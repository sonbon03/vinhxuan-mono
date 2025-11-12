import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../dto/response.dto';

/**
 * Response Transform Interceptor
 * Automatically transforms all successful responses to standardized format
 */
@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, ResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();
        const statusCode = response.statusCode || HttpStatus.OK;

        // If response is already in standardized format, return as is
        if (
          data &&
          typeof data === 'object' &&
          'statusCode' in data &&
          'message' in data &&
          'data' in data
        ) {
          return data;
        }

        // Otherwise, wrap the response in standardized format
        return {
          statusCode,
          message: 'Operation successful',
          data: data ?? null,
        };
      }),
    );
  }
}
