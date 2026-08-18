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
  const configuredMerchantId = settingsMap.simplepayMerchantId || process.env.SIMPLEPAY_MERCHANT_ID || 'OMS57078401';
  const configuredSecretKey  = settingsMap.simplepaySecretKey  || process.env.SIMPLEPAY_SECRET_KEY  || '32637af0d35a9b2105650800dc0366b8';

  let secretKey = '';
  const merchantId = ipn.merchant;

  if (ipn.merchant === configuredMerchantId || ipn.merchant === 'OMS57078401') {
    secretKey = configuredSecretKey;
  } else if (ipn.merchant === 'PUBLICTESTHUF') {
    secretKey = '32637af0d35a9b2105650800dc0366b8';
  } else {
    // Fallback to configured key
    secretKey = configuredSecretKey;
  }

  if (!secretKey) {
    console.error(`[SimplePay IPN] Secret key missing for merchant: ${ipn.merchant}`);
    return new Response('Configuration error', { status: 500 });
  }

  // Verify the signature from SimplePay
  if (!verifySignature(rawBody, signatureHeader, secretKey)) {
    console.error('[SimplePay IPN] Signature verification failed');
    return new Response('Invalid signature', { status: 401 });
  }

  console.log('[SimplePay IPN] Received:', ipn);

  // Map SimplePay event to internal status
  const statusMap: Record<string, string> = {
    SUCCESS: 'success',
    FAIL:    'failed',
    TIMEOUT: 'expired',
    CANCEL:  'cancelled',
  };
  const newStatus = statusMap[ipn.e] ?? 'unknown';

  // Update payment record
  try {
    await prisma.payment.updateMany({
      where: { simplePayOrderRef: ipn.orderRef },
      data: {
        status:            newStatus,
        simplePayTransId:  ipn.transactionId,
      },
    });
    console.log(`[SimplePay IPN] Payment ${ipn.orderRef} → ${newStatus}`);
  } catch (err) {
    console.error('[SimplePay IPN] DB update error:', err);
    // Still respond 200 so SimplePay doesn't retry infinitely
  }

  // Build the required confirmation response (must be signed)
  const confirmPayload = {
    salt:          generateSalt(),
    orderRef:      ipn.orderRef,
    merchant:      merchantId,
    transactionId: ipn.transactionId,
    e:             ipn.e,
  };
  const confirmSignature = generateSignature(confirmPayload, secretKey);

  return NextResponse.json(confirmPayload, {
    headers: { Signature: confirmSignature },
  });
}
