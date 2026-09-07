const crypto = require("crypto");

// RFC 4648 Base32 alphabet
const RFC4648_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Generate cryptographically secure base32 secret
 */
function generateSecret(length = 20) {
  const bytes = crypto.randomBytes(length);
  let secret = "";
  for (let i = 0; i < bytes.length; i++) {
    secret += RFC4648_ALPHABET[bytes[i] % 32];
  }
  return secret;
}

/**
 * Decode Base32 string to Buffer
 */
function base32Decode(str) {
  const cleaned = String(str || "").toUpperCase().replace(/=+$/, "");
  let bits = "";
  for (let i = 0; i < cleaned.length; i++) {
    const val = RFC4648_ALPHABET.indexOf(cleaned[i]);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

/**
 * Generate standard RFC 6238 TOTP code (6-digit)
 */
function generateTOTP(secret, timeStep = 30, stepOffset = 0) {
  const counter = Math.floor(Date.now() / 1000 / timeStep) + stepOffset;
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));

  const key = base32Decode(secret);
  const hmac = crypto.createHmac("sha1", key);
  hmac.update(buf);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0xf;
  const code = (
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff)
  ) % 1000000;

  return code.toString().padStart(6, "0");
}

/**
 * Verify TOTP code with time drift window (default ±1 step = ±30s)
 */
function verifyTOTP(token, secret, window = 1) {
  if (!token || !secret) return false;
  const cleanToken = String(token).trim().replace(/\s/g, "");
  for (let offset = -window; offset <= window; offset++) {
    if (generateTOTP(secret, 30, offset) === cleanToken) {
      return true;
    }
  }
  return false;
}

/**
 * Generate standard otpauth:// URI for authenticator apps
 */
function generateURI({ issuer = "Blogsify", label = "user", secret }) {
  const encIssuer = encodeURIComponent(issuer);
  const encLabel = encodeURIComponent(label);
  return `otpauth://totp/${encIssuer}:${encLabel}?secret=${secret}&issuer=${encIssuer}&algorithm=SHA1&digits=6&period=30`;
}

module.exports = {
  generateSecret,
  generateTOTP,
  verifyTOTP,
  generateURI,
};
