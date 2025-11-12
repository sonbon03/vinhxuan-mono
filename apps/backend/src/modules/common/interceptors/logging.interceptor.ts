import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, ip, body } = request;
    const userAgent = request.get('user-agent') || '';
    const now = Date.now();

    // Log incoming request
    this.logger.log(
      `Incoming Request: ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    // Log request body (excluding sensitive fields like passwords)
    if (body && Object.keys(body).length > 0) {
      const sanitizedBody = this.sanitizeBody(body);
      this.logger.debug(`Request Body: ${JSON.stringify(sanitizedBody)}`);
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const { statusCode } = response;
          const responseTime = Date.now() - now;

          this.logger.log(
            `Outgoing Response: ${method} ${url} - Status: ${statusCode} - ${responseTime}ms`,
          );

          // Log response data for debugging (optional, can be disabled in production)
          if (process.env.NODE_ENV === 'development') {
            this.logger.debug(`Response Data: ${JSON.stringify(data)}`);
          }
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `Error Response: ${method} ${url} - ${responseTime}ms`,
            error.stack,
          );
        },
      }),
    );
  }

  /**
   * Sanitize request body by removing sensitive fields
   */
  private sanitizeBody(body: any): any {
    const sensitiveFields = ['password', 'confirmPassword', 'accessToken', 'refreshToken', 'token'];
    const sanitized = { ...body };

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}
