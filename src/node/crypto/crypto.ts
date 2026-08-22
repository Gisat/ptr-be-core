import { createHash } from 'crypto';

/**
 * Non-cryptographic-safe hash (sha256) used for cache keys
 * Not suitable for security/cryptography purposes
 *
 * @param value - Any JSON-serializable value to hash.
 * @returns Hexadecimal SHA-256 digest as a string.
 */
export const cryptoNoCrypticHash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex')