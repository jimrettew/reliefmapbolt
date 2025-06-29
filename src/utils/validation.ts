export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
}

export const validationRules = {
  required: (fieldName: string): ValidationRule => ({
    test: (value: any) => value !== null && value !== undefined && value !== '',
    message: `${fieldName} is required.`,
  }),

  email: (): ValidationRule => ({
    test: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message: 'Please enter a valid email address.',
  }),

  minLength: (min: number): ValidationRule => ({
    test: (value: string) => value.length >= min,
    message: `Must be at least ${min} characters long.`,
  }),

  maxLength: (max: number): ValidationRule => ({
    test: (value: string) => value.length <= max,
    message: `Must be no more than ${max} characters long.`,
  }),

  password: (): ValidationRule => ({
    test: (value: string) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(value);
    },
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number.',
  }),

  phone: (): ValidationRule => ({
    test: (value: string) => {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(value.replace(/[\s\-()]/g, ''));
    },
    message: 'Please enter a valid phone number.',
  }),
};

// Validate a single field
export function validateField(value: any, rules: ValidationRule[]): ValidationResult {
  const errors: string[] = [];

  for (const rule of rules) {
    if (!rule.test(value)) {
      errors.push(rule.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate an object with multiple fields
export function validateObject(data: Record<string, any>, fieldRules: Record<string, ValidationRule[]>): ValidationResult {
  const errors: string[] = [];

  for (const [fieldName, rules] of Object.entries(fieldRules)) {
    const fieldValue = data[fieldName];
    const fieldValidation = validateField(fieldValue, rules);
    errors.push(...fieldValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate disaster data
export function validateDisasterData(data: any): ValidationResult {
  const requiredFields = ['id', 'title', 'subtitle', 'icon', 'iconColor', 'resourceCount'];
  const errors: string[] = [];

  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`${field} is required for disaster data.`);
    }
  }

  if (data.resourceCount && typeof data.resourceCount !== 'number') {
    errors.push('Resource count must be a number.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate map pin data
export function validateMapPinData(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data.organization && !data.name) {
    errors.push('Pin organization or name is required.');
  }
  if (!data.category) {
    errors.push('Pin category is required.');
  }
  if (typeof data.latitude !== 'number') {
    errors.push('Latitude must be a number.');
  }
  if (typeof data.longitude !== 'number') {
    errors.push('Longitude must be a number.');
  }
  if (!data.address) {
    errors.push('Address is required.');
  }

  if (data.latitude < -90 || data.latitude > 90) {
    errors.push('Latitude must be between -90 and 90.');
  }
  if (data.longitude < -180 || data.longitude > 180) {
    errors.push('Longitude must be between -180 and 180.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
