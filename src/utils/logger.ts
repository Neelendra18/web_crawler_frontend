import log from 'loglevel';
import * as Sentry from '@sentry/react';

// Configure loglevel
log.setLevel(import.meta.env.PROD ? 'warn' : 'debug');

// Sentry configuration
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: [/^https:\/\/.*\.yourdomain\.com/],
      }),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  [key: string]: unknown;
}

class Logger {
  // Mask PII fields in context (e.g., email, password, token, etc.)
  private maskSensitive(context?: LogContext): LogContext | undefined {
    if (!context) return context;
    const SENSITIVE_KEYS = ['email', 'password', 'token', 'accessToken', 'refreshToken', 'ssn', 'creditCard', 'secret'];
    const masked: LogContext = { ...context };
    for (const key of SENSITIVE_KEYS) {
      if (masked[key]) masked[key] = '[MASKED]';
    }
    return masked;
  }

  private createLogMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const maskedContext = this.maskSensitive(context);
    const contextStr = maskedContext ? ` | ${JSON.stringify(maskedContext)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    const logMessage = this.createLogMessage('debug', message, context);
    log.debug(logMessage);
  }

  info(message: string, context?: LogContext): void {
    const logMessage = this.createLogMessage('info', message, context);
    log.info(logMessage);
  }

  warn(message: string, context?: LogContext): void {
    const logMessage = this.createLogMessage('warn', message, context);
    log.warn(logMessage);
    if (context?.error) {
      Sentry.captureException(context.error);
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const logMessage = this.createLogMessage('error', message, { ...context, error: error?.message });
    log.error(logMessage, error);
    // Only pass primitive values to Sentry for tags/extra
    const filterPrimitives = (obj?: LogContext) => {
      if (!obj) return undefined;
      const out: { [key: string]: string | number | boolean } = {};
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
          out[k] = v;
        }
      }
      return out;
    };
    Sentry.captureException(error || new Error(message), {
      tags: filterPrimitives(context),
      extra: filterPrimitives(context),
    });
  }

  // Performance logging
  performance(metric: string, value: number, context?: LogContext): void {
    this.info(`Performance: ${metric}`, { ...context, value, metric });
  }

  // API logging
  apiRequest(method: string, url: string, context?: LogContext): void {
    this.info(`API Request: ${method} ${url}`, context);
  }

  apiResponse(method: string, url: string, status: number, duration?: number, context?: LogContext): void {
    const level = status >= 400 ? 'warn' : 'info';
    const message = `API Response: ${method} ${url} - ${status}${duration ? ` (${duration}ms)` : ''}`;
    this[level](message, { ...context, status, duration });
  }

  apiError(method: string, url: string, error: unknown, context?: LogContext): void {
    this.error(`API Error: ${method} ${url}`, error instanceof Error ? error : new Error(String(error)), { ...context, method, url });
  }

  // User action logging
  userAction(action: string, component: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, { ...context, component, action });
  }

  // Component lifecycle logging
  componentMount(component: string, context?: LogContext): void {
    this.debug(`Component Mounted: ${component}`, { ...context, component, lifecycle: 'mount' });
  }

  componentUnmount(component: string, context?: LogContext): void {
    this.debug(`Component Unmounted: ${component}`, { ...context, component, lifecycle: 'unmount' });
  }

  // Set user context for Sentry
  setUser(user: { id: string; email?: string; username?: string }): void {
    Sentry.setUser(user);
  }

  // Add breadcrumb for debugging
  addBreadcrumb(message: string, category?: string, level?: Sentry.SeverityLevel): void {
    Sentry.addBreadcrumb({
      message,
      category: category || 'custom',
      level: level || 'info',
    });
  }
}

export const logger = new Logger();
export default logger;