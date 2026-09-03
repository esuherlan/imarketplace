/**
 * Basic client-side input sanitization & validation helpers.
 * IMPORTANT: this is defense-in-depth only. Real validation/sanitization
 * must also be enforced on the backend once the API is available —
 * client-side JS can always be bypassed via devtools.
 */

const HTML_TAG_RE = /<[^>]*>/g;
const DANGEROUS_CHARS_RE = /[<>"'`]/g;

/** Strip HTML tags and characters commonly used in injection payloads, then trim.
 * Only use this for display-bound fields (name, etc). Never sanitize passwords —
 * they may legitimately contain any character and must be compared verbatim. */
export function sanitizeInput(value: string): string {
  return value.replace(HTML_TAG_RE, '').replace(DANGEROUS_CHARS_RE, '').trim();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return email.length > 0 && email.length <= 100 && EMAIL_RE.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8 && password.length <= 128;
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
}
