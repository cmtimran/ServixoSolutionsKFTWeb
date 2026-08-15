import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  generateSignature,
  generateSalt,
  getTimeoutDate,
  getSimplePayBase,
  SDK_VERSION,
  type SimplePayStartRequest,
  type SimplePayStartResponse,
} from '@/lib/simplepay';

export async function POST(req: Request) {
  try {
    const { productName, planTier, price, currency = 'HUF' } = await req.json();

    // Fetch SimplePay settings from DB
    const dbSettings = await prisma.setting.findMany({
      where: { key: { in: ['simplepayMerchantId', 'simplepaySecretKey', 'simplepayEnvironment'] } }
    });
    const settingsMap = dbSettings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as Record<string, string>);

    // DB > ENV > Fallback
    const rawMerchantId = settingsMap.simplepayMerchantId || process.env.SIMPLEPAY_MERCHANT_ID || '';
    const rawSecretKey  = settingsMap.simplepaySecretKey || process.env.SIMPLEPAY_SECRET_KEY || '';
    
    const merchantId  = rawMerchantId.trim() || 'PUBLICTESTHUF';
    const secretKey   = rawSecretKey.trim() || '32637af0d35a9b2105650800dc0366b8';
    const isLive      = settingsMap.simplepayEnvironment === 'live';
    const appUrl      = process.env.NEXT_PUBLIC_APP_URL || 'https://www.servixosolutionskft.com';

    if (!merchantId || !secretKey) {
      return NextResponse.json(
        { error: 'SimplePay credentials are not configured.' },
        { status: 500 }
      );
    }

    // Build a unique order reference (timestamp + random suffix)
    const orderRef = `SRVX-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    // Convert price to integer (SimplePay uses whole-unit amounts, e.g. HUF has no decimals)
    const totalAmount = currency === 'HUF'
      ? Math.round(parseFloat(String(price)) * 400).toString()   // approximate USD→HUF if price is in USD
      : parseFloat(String(price)).toFixed(2);

    const payload: SimplePayStartRequest = {
      salt:          generateSalt(),
      merchant:      merchantId,
      orderRef,
      currency:      currency as 'HUF' | 'EUR' | 'USD',
      customerEmail: 'sandbox@servixosolutionskft.com',   // placeholder for sandbox
      language:      'EN',
      sdkVersion:    SDK_VERSION,
      methods:       ['CARD'],
      total:         totalAmount,
      timeout:       getTimeoutDate(30),
      url:           `${appUrl}/checkout/simplepay-return`,
      invoice: {
        name:    'Servixo Customer',
        country: 'HU',
        state:   'Budapest',
        city:    'Budapest',
        zip:     '1081',
        address: 'Rakoczi ut 63',
      },
      items: [
        {
          ref:         orderRef,
          title:       `${productName} — ${planTier}`,
          description: `Subscription: ${productName} ${planTier} plan`,
          amount:      1,
          price:       parseFloat(totalAmount),
          tax:         0,
        },
      ],
    };

    const signature = generateSignature(payload, secretKey);

    const spBase = getSimplePayBase(isLive);
    const spRes = await fetch(`${spBase}/start`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Signature':     signature,
        'Accept':        'application/json',
      },
      body: JSON.stringify(payload).replace(/\//g, '\\/'),
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
      return NextResponse.json(
        { error: `SimplePay error: ${JSON.stringify(spData.errorCodes ?? spData)}` },
        { status: 400 }
      );
    }

    // Persist a pending payment record
    await prisma.payment.create({
      data: {
        sessionId:         spData.transactionId,
        productName,
        planTier,
        amount:            parseFloat(totalAmount),
        currency,
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
