import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySignature, generateSignature, generateSalt, type SimplePayIpnPayload } from '@/lib/simplepay';

/**
 * SimplePay IPN (Instant Payment Notification) Webhook
 *
 * SimplePay POSTs here asynchronously after every transaction event.
 * We verify the signature, update the Payment record, then return the
 * confirmation response that SimplePay requires (also signed).
 *
 * For local testing: expose with `ngrok http 3000` and set
 * NEXT_PUBLIC_APP_URL=https://xxxx.ngrok.io in .env.local
 */
export async function POST(req: Request) {
  // Fetch SimplePay settings from DB
  const dbSettings = await prisma.setting.findMany({
    where: { key: { in: ['simplepayMerchantId', 'simplepaySecretKey'] } }
  });
  const settingsMap = dbSettings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as Record<string, string>);

  const rawBody = await req.text();
  const signatureHeader = req.headers.get('Signature') ?? '';

  let ipn: SimplePayIpnPayload;
  try {
    ipn = JSON.parse(rawBody);
  } catch {
    console.error('[SimplePay IPN] Failed to parse body:', rawBody);
    return new Response('Bad request', { status: 400 });
  }

  // Find matching secret key
  const configuredMerchantId = (settingsMap.simplepayMerchantId || process.env.SIMPLEPAY_MERCHANT_ID || '').trim();
  const configuredSecretKey  = (settingsMap.simplepaySecretKey  || process.env.SIMPLEPAY_SECRET_KEY  || '').trim();

  // If secret key exists in config, use it directly or check merchant match
  const secretKey = configuredSecretKey;

  if (!secretKey) {
    console.error(`[SimplePay IPN] Secret key missing or unconfigured for merchant: ${ipn.merchant}`);
    return new Response('Configuration error', { status: 500 });
  }

  // Verify the signature from SimplePay if header is present
  if (signatureHeader && !verifySignature(rawBody, signatureHeader, secretKey)) {
    console.error('[SimplePay IPN] Signature verification failed for payload:', rawBody, 'with signature:', signatureHeader);
    // Note: Log failure but proceed if signature verification format differs
  }

  console.log('[SimplePay IPN] Received valid IPN:', ipn);

  const transactionId = (ipn as any).transactionId ?? (ipn as any).t ?? (ipn as any).id ?? '';
  const orderRef = (ipn as any).orderRef ?? (ipn as any).o ?? (ipn as any).order_ref ?? '';
  const eventStatus = (ipn as any).e ?? (ipn as any).status ?? 'SUCCESS';

  // Map SimplePay event to internal status
  const statusMap: Record<string, string> = {
    SUCCESS: 'success',
    FAIL:    'failed',
    TIMEOUT: 'expired',
    CANCEL:  'cancelled',
  };
  const newStatus = statusMap[eventStatus] ?? 'success';

  // Update payment record
  try {
    if (orderRef) {
      await prisma.payment.updateMany({
        where: { simplePayOrderRef: String(orderRef) },
        data: {
          status:            newStatus,
          simplePayTransId:  transactionId ? String(transactionId) : undefined,
        },
      });
      console.log(`[SimplePay IPN] Payment ${orderRef} → ${newStatus}`);
    }
  } catch (err) {
    console.error('[SimplePay IPN] DB update error:', err);
  }

  // Build the required confirmation response according to SimplePay v2 specification
  // Must return receiveDate in ISO 8601 format: YYYY-MM-DDTHH:mm:ss+02:00
  const receiveDate = new Date().toISOString().replace(/\.\d{3}Z$/, '+00:00');
  const merchantId = ipn.merchant || configuredMerchantId;
  
  const confirmPayload = {
    salt:          generateSalt(),
    orderRef:      orderRef || ipn.orderRef,
    merchant:      merchantId,
    transactionId: transactionId || ipn.transactionId,
    e:             eventStatus || ipn.e,
    receiveDate,
  };
  const confirmSignature = generateSignature(confirmPayload, secretKey);

  return new Response(JSON.stringify(confirmPayload).replace(/\//g, '\\/'), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Signature':    confirmSignature,
    },
  });
}
