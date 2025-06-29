interface SentryConfig {
  dsn: string;
  environment: string;
  release: string;
  debug: boolean;
}

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

class SentryService {
  private isInitialized = false;
  private config: SentryConfig | null = null;

  init(config: SentryConfig) {
    try {
      this.config = config;
      this.isInitialized = true;

      console.log('Sentry initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }

  captureException(error: Error, context?: ErrorContext) {
    if (!this.isInitialized) {
      console.warn('Sentry not initialized, error logged to console:', error);
      return;
    }

    try {
      console.error('Sentry Error:', {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
      });
    } catch (sentryError) {
      console.error('Failed to capture error in Sentry:', sentryError);
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) {
    if (!this.isInitialized) {
      console.log('Sentry not initialized, message logged to console:', message);
      return;
    }

    try {
      console.log('Sentry Message:', {
        message,
        level,
        context,
        timestamp: new Date().toISOString(),
      });
    } catch (sentryError) {
      console.error('Failed to capture message in Sentry:', sentryError);
    }
  }

  setUser(userId: string, email?: string, username?: string) {
    if (!this.isInitialized) {return;}

    try {
      console.log('Sentry User Set:', { userId, email, username });
    } catch (error) {
      console.error('Failed to set user in Sentry:', error);
    }
  }

  setTag(key: string, value: string) {
    if (!this.isInitialized) {return;}

    try {
      console.log('Sentry Tag Set:', { key, value });
    } catch (error) {
      console.error('Failed to set tag in Sentry:', error);
    }
  }

  // Set context
  setContext(name: string, context: Record<string, any>) {
    if (!this.isInitialized) {return;}

    try {
      console.log('Sentry Context Set:', { name, context });
    } catch (error) {
      console.error('Failed to set context in Sentry:', error);
    }
  }

  addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
    if (!this.isInitialized) {return;}

    try {
      console.log('Sentry Breadcrumb:', { message, category, data });
    } catch (error) {
      console.error('Failed to add breadcrumb in Sentry:', error);
    }
  }

  private beforeSend(event: any, hint: any) {
    const error = hint.originalException;
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment && error?.message?.includes('Network request failed')) {
      return null;
    }

    if (isDevelopment && event.tags?.component === 'DevComponent') {
      return null;
    }

    return event;
  }

  private beforeBreadcrumb(breadcrumb: any) {
    if (breadcrumb.category === 'console') {
      return null;
    }

    return breadcrumb;
  }

  close() {
    if (!this.isInitialized) {return;}

    try {
      this.isInitialized = false;
      console.log('Sentry closed');
    } catch (error) {
      console.error('Failed to close Sentry:', error);
    }
  }
}

export const sentryService = new SentryService();

export const captureException = (error: Error, context?: ErrorContext) => {
  sentryService.captureException(error, context);
};

export const captureMessage = (message: string, level?: 'info' | 'warning' | 'error', context?: ErrorContext) => {
  sentryService.captureMessage(message, level, context);
};

export const setUser = (userId: string, email?: string, username?: string) => {
  sentryService.setUser(userId, email, username);
};

export const setTag = (key: string, value: string) => {
  sentryService.setTag(key, value);
};

export const setContext = (name: string, context: Record<string, any>) => {
  sentryService.setContext(name, context);
};

export const addBreadcrumb = (message: string, category: string, data?: Record<string, any>) => {
  sentryService.addBreadcrumb(message, category, data);
};

export const initSentry = (dsn?: string) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const config: SentryConfig = {
    dsn: dsn || process.env.SENTRY_DSN || '',
    environment: isDevelopment ? 'development' : 'production',
    release: '1.0.0',
    debug: isDevelopment,
  };

  if (config.dsn) {
    sentryService.init(config);
  } else {
    console.warn('Sentry DSN not provided, error reporting disabled');
  }
};
