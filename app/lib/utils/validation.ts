// String validation utilities
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

export function isMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}

export function isExactLength(value: string, length: number): boolean {
  return value.length === length;
}

export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}

export function isAlphabetic(value: string): boolean {
  return /^[a-zA-Z\s]+$/.test(value);
}

export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

export function isDecimal(value: string): boolean {
  return /^\d*\.?\d+$/.test(value);
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Phone number validation
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Date validation
export function isValidDate(date: string): boolean {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

export function isFutureDate(date: string): boolean {
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj > now;
}

export function isPastDate(date: string): boolean {
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj < now;
}

// Number validation
export function isPositiveNumber(value: number): boolean {
  return typeof value === 'number' && value > 0;
}

export function isNonNegativeNumber(value: number): boolean {
  return typeof value === 'number' && value >= 0;
}

export function isInRange(value: number, min: number, max: number): boolean {
  return typeof value === 'number' && value >= min && value <= max;
}

// Array validation
export function isNotEmptyArray<T>(array: T[]): boolean {
  return Array.isArray(array) && array.length > 0;
}

export function isArrayOfLength<T>(array: T[], length: number): boolean {
  return Array.isArray(array) && array.length === length;
}

export function isArrayMinLength<T>(array: T[], minLength: number): boolean {
  return Array.isArray(array) && array.length >= minLength;
}

export function isArrayMaxLength<T>(array: T[], maxLength: number): boolean {
  return Array.isArray(array) && array.length <= maxLength;
}

// Object validation
export function isNotEmptyObject(obj: Record<string, any>): boolean {
  return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
}

export function hasRequiredKeys(obj: Record<string, any>, requiredKeys: string[]): boolean {
  return requiredKeys.every(key => key in obj);
}

export function hasOnlyAllowedKeys(obj: Record<string, any>, allowedKeys: string[]): boolean {
  return Object.keys(obj).every(key => allowedKeys.includes(key));
}

// Password validation
export function isStrongPassword(password: string): boolean {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  
  if (score < 3) return 'weak';
  if (score < 5) return 'medium';
  return 'strong';
}

// Credit card validation
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// File validation
export function isValidFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function isValidImageFile(file: File): boolean {
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return isValidFileType(file, imageTypes);
}

// Composite validation functions
export function validateRequired(value: any): boolean {
  if (typeof value === 'string') return isNotEmpty(value);
  if (Array.isArray(value)) return isNotEmptyArray(value);
  if (typeof value === 'object') return isNotEmptyObject(value);
  return value !== null && value !== undefined;
}

export function validateField(value: any, rules: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (rules.required && !validateRequired(value)) {
    errors.push('This field is required');
  }
  
  if (typeof value === 'string') {
    if (rules.minLength && !isMinLength(value, rules.minLength)) {
      errors.push(`Minimum length is ${rules.minLength} characters`);
    }
    
    if (rules.maxLength && !isMaxLength(value, rules.maxLength)) {
      errors.push(`Maximum length is ${rules.maxLength} characters`);
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push('Invalid format');
    }
  }
  
  if (rules.custom && !rules.custom(value)) {
    errors.push('Invalid value');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
} 