import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let data: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        data = (exceptionResponse as any).data || null;
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    } else {
      this.logger.error('Unknown exception occurred', exception);
    }

    // Log the error
    this.logger.error(
      `HTTP ${status} Error - ${request.method} ${request.url}`,
      {
        statusCode: status,
        message,
        data,
        timestamp: new Date().toISOString(),
        ip: request.ip,
        userAgent: request.get('user-agent'),
      },
    );

    response.status(status).json({
      statusCode: status,
      message: message,
      data: data,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }
}
