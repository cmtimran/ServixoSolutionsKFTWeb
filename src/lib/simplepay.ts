/**
 * SimplePay API v2 SDK & Utility Library
 * OTP Mobil Kft. — Hungary's SimplePay payment gateway
 *
 * Docs: https://simplepay.hu/fejlesztoknek/
 * Algorithm: HMAC-SHA384 + Base64, with "/" → "\/" JSON escaping
 */

import crypto from 'crypto';

// ─── Constants ────────────────────────────────────────────────────────────────

export const SIMPLEPAY_SANDBOX_BASE = 'https://sandbox.simplepay.hu/payment/v2';
export const SIMPLEPAY_LIVE_BASE    = 'https://secure.simplepay.hu/payment/v2';
export const SDK_VERSION            = 'SimplePayV2.1_NextJS_Servixo';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SimplePayConfig {
  merchantId?: string;
  secretKey?: string;
  sandbox?: boolean;
  environment?: 'sandbox' | 'live';
  appUrl?: string;
}

export interface SimplePayStartRequest {
  salt: string;
  merchant: string;
  orderRef: string;
  currency: 'HUF' | 'EUR' | 'USD';
  customerEmail: string;
  language: string;
  sdkVersion: string;
  methods: string[];
  total: number | string;
  timeout: string;       // ISO 8601 datetime — order expires after this
  url: string;           // Back-redirect URL (customer lands here after payment)
  invoice: {
    name: string;
    company?: string;
    country: string;
    state: string;
    city: string;
    zip: string;
    address: string;
    address2?: string;
  };
  items?: Array<{
    ref: string;
    title: string;
    description?: string;
    amount: number;
    price: number;
    tax?: number;
  }>;
}

export interface SimplePayStartResponse {
  salt: string;
  merchant: string;
  orderRef: string;
  currency: string;
  transactionId: string;
  timeout: string;
  total: string;
  paymentUrl: string;
  errorCodes?: number[];
}

export interface SimplePayIpnPayload {
  salt: string;
  orderRef: string;
  merchant: string;
  transactionId: string;
  e: 'SUCCESS' | 'FAIL' | 'TIMEOUT' | 'CANCEL';
  status?: string;
}

export interface TransactionStartParams {
  orderRef?: string;
  currency?: 'HUF' | 'EUR' | 'USD';
  customerEmail: string;
  customerName?: string;
  companyName?: string;
  language?: 'HU' | 'EN' | 'DE' | 'RO';
  total: number;
  returnUrl?: string;
  timeoutMinutes?: number;
  invoice: {
    name: string;
    company?: string;
    country: string;
    state?: string;
    city: string;
    zip: string;
    address: string;
    address2?: string;
  };
  items?: Array<{
    ref: string;
    title: string;
    description?: string;
    amount: number;
    price: number;
    tax?: number;
  }>;
}

// ─── SimplePay SDK Class ──────────────────────────────────────────────────────

export class SimplePaySDK {
  public merchantId: string;
  public secretKey: string;
  public environment: 'sandbox' | 'live';
  public baseUrl: string;
  public appUrl: string;

  constructor(config?: SimplePayConfig) {
    this.merchantId = (config?.merchantId || process.env.SIMPLEPAY_MERCHANT_ID || '').trim();
    this.secretKey = (config?.secretKey || process.env.SIMPLEPAY_SECRET_KEY || '').trim();

    const envConfig = config?.environment || 
      (process.env.SIMPLEPAY_ENVIRONMENT as 'sandbox' | 'live') || 
      (config?.sandbox || process.env.SIMPLEPAY_SANDBOX === 'true' ? 'sandbox' : 'sandbox');

    this.environment = envConfig;

    const isSandboxMerchant = this.merchantId === 'PUBLICTESTHUF';
    if (this.environment === 'live' && !isSandboxMerchant) {
      this.baseUrl = SIMPLEPAY_LIVE_BASE;
    } else {
      this.baseUrl = SIMPLEPAY_SANDBOX_BASE;
    }

    this.appUrl = config?.appUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://www.servixosolutionskft.com';
  }

  /**
   * Generates HMAC-SHA384 Base64 signature with forward slash JSON escaping (\/)
   */
  public generateSignature(payload: object, secretKeyOverride?: string): string {
    const key = secretKeyOverride || this.secretKey;
    const json = JSON.stringify(payload).replace(/\//g, '\\/');
    return crypto
      .createHmac('sha384', Buffer.from(key, 'utf-8'))
      .update(Buffer.from(json, 'utf-8'))
      .digest('base64');
  }

  /**
   * Verifies incoming signature header against body payload
   */
  public verifySignature(rawBody: string, signatureHeader: string, secretKeyOverride?: string): boolean {
    const key = secretKeyOverride || this.secretKey;
    const expected = crypto
      .createHmac('sha384', Buffer.from(key, 'utf-8'))
      .update(Buffer.from(rawBody, 'utf-8'))
      .digest('base64');
    return expected === signatureHeader;
  }

  /**
   * Generates a 32-char random hex salt
   */
  public generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Formats ISO datetime string N minutes from now for SimplePay timeout
   */
  public getTimeoutDate(minutesFromNow = 30): string {
    const d = new Date(Date.now() + minutesFromNow * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      d.getFullYear() + '-' +
      pad(d.getMonth() + 1) + '-' +
      pad(d.getDate()) + 'T' +
      pad(d.getHours()) + ':' +
      pad(d.getMinutes()) + ':' +
      pad(d.getSeconds()) + '+02:00'
    );
  }

  /**
   * Initiates payment with SimplePay API (/payment/v2/start)
   */
  public async startTransaction(params: TransactionStartParams): Promise<{
    ok: boolean;
    paymentUrl?: string;
    transactionId?: string;
    orderRef: string;
    error?: string;
    rawResponse?: any;
  }> {
    if (!this.merchantId || !this.secretKey) {
      throw new Error('SimplePay SDK Error: Merchant ID and Secret Key must be configured.');
    }

    const orderRef = params.orderRef || `SRVX-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const timeout = this.getTimeoutDate(params.timeoutMinutes || 30);
    const returnUrl = params.returnUrl || `${this.appUrl}/checkout/simplepay-return`;

    const payload: SimplePayStartRequest = {
      salt: this.generateSalt(),
      merchant: this.merchantId,
      orderRef,
      currency: params.currency || 'HUF',
      customerEmail: params.customerEmail,
      language: params.language || 'HU',
      sdkVersion: SDK_VERSION,
      methods: ['CARD'],
      total: Math.round(params.total),
      timeout,
      url: returnUrl,
      invoice: {
        name: params.invoice.name,
        company: params.invoice.company,
        country: (params.invoice.country || 'HU').toUpperCase(),
        state: params.invoice.state || params.invoice.city || 'Budapest',
        city: params.invoice.city || 'Budapest',
        zip: params.invoice.zip || '1081',
        address: params.invoice.address || 'Rákóczi út 63',
        address2: params.invoice.address2,
      },
      ...(params.items ? { items: params.items } : {}),
    };

    const jsonBody = JSON.stringify(payload).replace(/\//g, '\\/');
    const signature = this.generateSignature(payload);

    const response = await fetch(`${this.baseUrl}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Signature': signature,
        'Accept': 'application/json',
      },
      body: jsonBody,
    });

    const resText = await response.text();
    let resData: SimplePayStartResponse;
    try {
      resData = JSON.parse(resText);
    } catch {
      throw new Error(`SimplePay response parse error: ${resText}`);
    }

    if (!response.ok || resData.errorCodes?.length) {
      return {
        ok: false,
        orderRef,
        error: `SimplePay Error (${resData.errorCodes?.join(', ') || response.status}): ${JSON.stringify(resData)}`,
        rawResponse: resData,
      };
    }

    return {
      ok: true,
      paymentUrl: resData.paymentUrl,
      transactionId: String(resData.transactionId),
      orderRef,
      rawResponse: resData,
    };
  }

  /**
   * Processes incoming IPN webhook notification from SimplePay
   * Returns validation status, normalized order data, and ready-to-return signed acknowledgement payload.
   */
  public processIpn(rawBody: string, signatureHeader?: string) {
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return { valid: false, error: 'Invalid JSON payload' };
    }

    const isValidSignature = signatureHeader
      ? this.verifySignature(rawBody, signatureHeader)
      : true;

    const receiveDate = new Date().toISOString().replace(/\.\d{3}Z$/, '+00:00');
    const confirmPayload = {
      ...payload,
      receiveDate,
    };

    const confirmJsonString = JSON.stringify(confirmPayload).replace(/\//g, '\\/');
    const confirmSignature = this.generateSignature(confirmPayload);

    const statusMap: Record<string, string> = {
      SUCCESS: 'success',
      FAIL: 'failed',
      TIMEOUT: 'expired',
      CANCEL: 'cancelled',
    };

    const eventStatus = payload.e || payload.status || 'SUCCESS';
    const normalizedStatus = statusMap[eventStatus] || 'success';

    return {
      valid: isValidSignature,
      merchantId: payload.merchant,
      orderRef: payload.orderRef || payload.o || payload.order_ref || '',
      transactionId: String(payload.transactionId || payload.t || payload.id || ''),
      status: normalizedStatus,
      rawStatus: eventStatus,
      payload,
      responseBody: confirmJsonString,
      responseSignature: confirmSignature,
    };
  }
}

// ─── Standalone Helper Functions (Backwards Compatibility) ────────────────────

export function generateSignature(payload: object, secretKey: string): string {
  const json = JSON.stringify(payload).replace(/\//g, '\\/');
  return crypto
    .createHmac('sha384', Buffer.from(secretKey, 'utf-8'))
    .update(Buffer.from(json, 'utf-8'))
    .digest('base64');
}

export function verifySignature(
  rawBody: string,
  signatureHeader: string,
  secretKey: string
): boolean {
  const expected = crypto
    .createHmac('sha384', Buffer.from(secretKey, 'utf-8'))
    .update(Buffer.from(rawBody, 'utf-8'))
    .digest('base64');
  return expected === signatureHeader;
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function getTimeoutDate(minutesFromNow = 30): string {
  const d = new Date(Date.now() + minutesFromNow * 60 * 1000);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    d.getFullYear() + '-' +
    pad(d.getMonth() + 1) + '-' +
    pad(d.getDate()) + 'T' +
    pad(d.getHours()) + ':' +
    pad(d.getMinutes()) + ':' +
    pad(d.getSeconds()) + '+02:00'
  );
}

export function getSimplePayBase(isLive: boolean = false, merchantId?: string): string {
  if (process.env.SIMPLEPAY_ENVIRONMENT === 'live' || isLive) {
    return SIMPLEPAY_LIVE_BASE;
  }
  return SIMPLEPAY_SANDBOX_BASE;
}

