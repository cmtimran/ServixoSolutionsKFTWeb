/**
 * SimplePay API v2 Utility Library
 * OTP Mobil Kft. — Hungary's SimplePay payment gateway
 *
 * Docs: https://simplepay.hu/fejlesztoknek/
 * Algorithm: HMAC-SHA384 + Base64, with "/" → "\/" JSON escaping
 */

import crypto from 'crypto';

// ─── Constants ────────────────────────────────────────────────────────────────

export const SIMPLEPAY_SANDBOX_BASE = 'https://sandbox.simplepay.hu/payment/v2';
export const SIMPLEPAY_LIVE_BASE    = 'https://simplepay.hu/payment/v2';
export const SDK_VERSION            = 'SimplePayV2.1_NextJS_Servixo';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SimplePayStartRequest {
  salt: string;
  merchant: string;
  orderRef: string;
  currency: 'HUF' | 'EUR' | 'USD';
  customerEmail: string;
  language: string;
  sdkVersion: string;
  methods: string[];
  total: string;
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
    description: string;
    amount: number;
    price: number;
    tax: number;
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

// ─── Signature helpers ────────────────────────────────────────────────────────

/**
 * Generates an HMAC-SHA384 + Base64 signature for a JSON payload.
 * IMPORTANT: forward slashes in URLs must be escaped as "\/" to match
 * PHP's json_encode behaviour (which SimplePay uses server-side).
 */
export function generateSignature(payload: object, secretKey: string): string {
  const json = JSON.stringify(payload).replace(/\//g, '\\/');
  return crypto
    .createHmac('sha384', secretKey)
    .update(json)
    .digest('base64');
}

/**
 * Verifies that the Signature header sent by SimplePay matches the body.
 */
export function verifySignature(
  rawBody: string,
  signatureHeader: string,
  secretKey: string
): boolean {
  const expected = crypto
    .createHmac('sha384', secretKey)
    .update(rawBody)
    .digest('base64');
  return expected === signatureHeader;
}

/**
 * Generates a random alphanumeric salt (32 chars) for each request.
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// ─── Timeout helper ───────────────────────────────────────────────────────────

/**
 * Returns an ISO 8601 datetime string N minutes from now.
 * SimplePay requires the order timeout to be in the future.
 */
export function getTimeoutDate(minutesFromNow = 30): string {
  const d = new Date(Date.now() + minutesFromNow * 60 * 1000);
  return d.toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

// ─── Base URL resolver ────────────────────────────────────────────────────────

export function getSimplePayBase(): string {
  return process.env.SIMPLEPAY_SANDBOX === 'true'
    ? SIMPLEPAY_SANDBOX_BASE
    : SIMPLEPAY_LIVE_BASE;
}
