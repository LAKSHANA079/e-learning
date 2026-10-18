/**
 * Front-end Security Utilities (Experiment 2f)
 * - XSS Prevention & Input Sanitization
 * - Secure Password Strength Validation
 * - Safe Token Handling
 */

/**
 * Sanitizes user input to prevent Cross-Site Scripting (XSS) attacks.
 * Encodes special HTML entities and removes malicious script tags.
 */
export function sanitizeInput(input) {
  if (typeof input !== "string") return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // strip script tags
    .replace(/javascript:/gi, "") // strip javascript: pseudo-protocols
    .replace(/on\w+=/gi, "") // strip event handlers like onerror, onclick
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/**
 * Validates password strength to enforce front-end security best practices.
 * Must be at least 8 characters, include uppercase, lowercase, number, and special character.
 */
export function validatePassword(password) {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long."
    };
  }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return {
      isValid: false,
      message: "Password must contain uppercase, lowercase, a number, and a special character."
    };
  }

  return {
    isValid: true,
    message: "Strong password."
  };
}

/**
 * Validates email format with strict regex.
 */
export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(String(email).toLowerCase());
}
