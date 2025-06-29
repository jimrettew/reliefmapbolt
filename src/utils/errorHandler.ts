import { captureException, captureMessage, addBreadcrumb, setUser, setTag } from './sentry';

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: Date;
  userId?: string;
  context?: Record<string, any>;
}

class ErrorHandler {
  private errors: ErrorInfo[] = [];
  private maxErrors = 100;

  logError(error: Error, _errorInfo?: React.ErrorInfo, context?: Record<string, any>) {
    const errorInfoObj: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: _errorInfo?.componentStack || undefined,
      timestamp: new Date(),
      context,
    };

    this.errors.push(errorInfoObj);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    if (__DEV__) {
      console.error('Error logged:', errorInfoObj);
    }

    captureException(error, context);

    addBreadcrumb('Error occurred', 'error', {
      message: error.message,
      component: context?.component,
      action: context?.action,
    });
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }

  private sendToErrorService(errorInfo: ErrorInfo) {
  }

  handleNetworkError(error: Error): string {
    const message = error.message.includes('Network request failed')
      ? 'Network error. Please check your internet connection.'
      : error.message.includes('timeout')
      ? 'Request timed out. Please try again.'
      : 'A network error occurred. Please try again.';

    captureException(error, {
      component: 'NetworkHandler',
      action: 'handleNetworkError',
      errorType: 'network',
    });

    return message;
  }

  handleAuthError(error: any): string {
    const errorCode = error?.code || error?.message;
    let message: string;

    switch (errorCode) {
      case 'auth/user-not-found':
        message = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists.';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak. Please choose a stronger password.';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        break;
      default:
        message = 'Authentication failed. Please try again.';
    }

    captureException(error, {
      component: 'AuthHandler',
      action: 'handleAuthError',
      errorCode,
      errorType: 'authentication',
    });

    return message;
  }

  handleMapError(error: Error): string {
    const message = error.message.includes('Google Maps')
      ? 'Map loading failed. Please check your internet connection.'
      : error.message.includes('coordinates')
      ? 'Invalid location data. Please try again.'
      : 'Map error occurred. Please try again.';

    captureException(error, {
      component: 'MapHandler',
      action: 'handleMapError',
      errorType: 'map',
    });

    return message;
  }

  validateData(data: any, schema: Record<string, any>): string[] {
    const errors: string[] = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      if (rules.required && !value) {
        errors.push(`${field} is required.`);
      }

      if (rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be a ${rules.type}.`);
      }

      if (rules.minLength && value && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters.`);
      }

      if (rules.maxLength && value && value.length > rules.maxLength) {
        errors.push(`${field} must be no more than ${rules.maxLength} characters.`);
      }
    }

    if (errors.length > 0) {
      captureMessage('Data validation failed', 'warning', {
        component: 'ValidationHandler',
        action: 'validateData',
        errors,
        data: JSON.stringify(data),
      });
    }

    return errors;
  }

  setUserContext(userId: string, email?: string, username?: string) {
    setUser(userId, email, username);
    setTag('user_id', userId);
  }

  trackPerformance(operation: string, duration: number, context?: Record<string, any>) {
    addBreadcrumb(`Performance: ${operation}`, 'performance', {
      duration,
      operation,
      ...context,
    });

    if (duration > 1000) {
      captureMessage(`Slow operation detected: ${operation}`, 'warning', {
        component: 'PerformanceTracker',
        action: 'trackPerformance',
        duration,
        operation,
        ...context,
      });
    }
  }
}

export const errorHandler = new ErrorHandler();

export const logError = (error: Error, _errorInfo?: React.ErrorInfo, context?: Record<string, any>) => {
  errorHandler.logError(error, _errorInfo, context);
};

export const handleNetworkError = (error: Error): string => {
  return errorHandler.handleNetworkError(error);
};

export const handleAuthError = (error: any): string => {
  return errorHandler.handleAuthError(error);
};

export const handleMapError = (error: Error): string => {
  return errorHandler.handleMapError(error);
};

export const setUserContext = (userId: string, email?: string, username?: string) => {
  errorHandler.setUserContext(userId, email, username);
};

export const trackPerformance = (operation: string, duration: number, context?: Record<string, any>) => {
  errorHandler.trackPerformance(operation, duration, context);
};
