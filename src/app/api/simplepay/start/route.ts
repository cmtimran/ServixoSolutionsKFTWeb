import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import {
  generateSalt,
  getTimeoutDate,
  getSimplePayBase,
  SDK_VERSION,
  type SimplePayStartRequest,
  type SimplePayStartResponse,
} from '@/lib/simplepay';

export async function POST(req: Request) {
  try {
    const {
      productName,
      planTier,
      price,
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      taxNumber,
      billingAddress,
      billingCity,
      billingZip,
      billingCountry = 'HU',
    } = await req.json();

    // Fetch SimplePay settings from DB
    const dbSettings = await prisma.setting.findMany({
      where: { key: { in: ['simplepayMerchantId', 'simplepaySecretKey', 'simplepayEnvironment'] } }
    });
    const settingsMap = dbSettings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as Record<string, string>);

    const isLive = settingsMap.simplepayEnvironment === 'live';

    const rawMerchantId = settingsMap.simplepayMerchantId || process.env.SIMPLEPAY_MERCHANT_ID || '';
    const rawSecretKey  = settingsMap.simplepaySecretKey  || process.env.SIMPLEPAY_SECRET_KEY  || '';

    const merchantId = rawMerchantId.trim();
    const secretKey  = rawSecretKey.trim();
    const appUrl     = process.env.NEXT_PUBLIC_APP_URL || 'https://www.servixosolutionskft.com';

    if (!merchantId || !secretKey) {
      return NextResponse.json(
        { error: 'SimplePay credentials are not configured. Please set them in Admin Panel Settings.' },
        { status: 500 }
      );
    }

    // Build a unique order reference (timestamp + random suffix)
    const orderRef = `SRVX-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    // SimplePay HUF requires integer amount (no decimals)
    const numericPrice = Math.round(parseFloat(String(price)) || 120000);
    const totalAmount = numericPrice.toString();

    const payload: any = {
      salt:          generateSalt(),
      merchant:      merchantId,
      orderRef,
      currency:      'HUF',
      customerEmail: customerEmail || 'customer@servixosolutionskft.com',
      language:      'HU',
      sdkVersion:    SDK_VERSION,
      methods:       ['CARD'],
      total:         numericPrice,
      timeout:       getTimeoutDate(30),
      url:           `${appUrl}/checkout/simplepay-return`,
      invoice: {
        name:    companyName || customerName || 'Servixo Customer',
        country: (billingCountry || 'HU').toUpperCase(),
        state:   billingCity || 'Budapest',
        city:    billingCity || 'Budapest',
        zip:     billingZip || '1081',
        address: billingAddress || 'Rákóczi út 63',
      },
    };

    // Convert payload to exact escaped JSON string once (single source of truth for HMAC and body)
    const jsonBody = JSON.stringify(payload).replace(/\//g, '\\/');
    const signature = crypto
      .createHmac('sha384', Buffer.from(secretKey, 'utf-8'))
      .update(Buffer.from(jsonBody, 'utf-8'))
      .digest('base64');

    const spBase = getSimplePayBase(isLive);
    const spRes = await fetch(`${spBase}/start`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json; charset=utf-8',
        'Signature':     signature,
        'Accept':        'application/json',
      },
      body: jsonBody,
    });

    const spText = await spRes.text();
    let spData: SimplePayStartResponse;

    try {
      spData = JSON.parse(spText);
    } catch {
      console.error('[SimplePay] Non-JSON response:', spText);
      return NextResponse.json({ error: 'Unexpected response from SimplePay' }, { status: 502 });
    }

    if (!spRes.ok || spData.errorCodes?.length) {
      console.error('[SimplePay] Error response:', spData);
      const maskedKey = secretKey.length > 8 
        ? `${secretKey.slice(0, 4)}...${secretKey.slice(-4)} (len: ${secretKey.length})` 
        : `len: ${secretKey.length}`;
      return NextResponse.json(
        { 
          error: `SimplePay error: ${JSON.stringify(spData.errorCodes ?? spData)} (Endpoint: ${spBase}, Merchant: "${merchantId}", Key: ${maskedKey})` 
        },
        { status: 400 }
      );
    }

    // Persist a pending payment record in HUF with full customer details
    await prisma.payment.create({
      data: {
        sessionId:         String(spData.transactionId),
        customerName:      customerName || null,
        customerEmail:     customerEmail || null,
        customerPhone:     customerPhone || null,
        companyName:       companyName || null,
        taxNumber:         taxNumber || null,
        billingAddress:    billingAddress || null,
        billingCity:       billingCity || null,
        billingZip:        billingZip || null,
        billingCountry:    billingCountry || 'HU',
        productName,
        planTier,
        amount:            numericPrice,
        currency:          'HUF',
        status:            'pending',
        simplePayOrderRef: orderRef,
      },
    });

    return NextResponse.json({ paymentUrl: spData.paymentUrl, orderRef });
  } catch (err: any) {
    console.error('[SimplePay /start] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
