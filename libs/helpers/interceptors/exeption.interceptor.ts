import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class FormatErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          const status = error.getStatus();
          const response = error.getResponse();

          // Check if the error response is an object
          const errorResponse =
            typeof response === 'string'
              ? { message: [response] }
              : {
                  message: Array.isArray(response['message'])
                    ? response['message']
                    : [response['message']],
                  error: response['error'] || error.message || 'Bad Request',
                  statusCode: status,
                };

          return throwError(() => new HttpException(errorResponse, status));
        }

        // Handle non-HttpException errors (unexpected errors)
        return throwError(
          () =>
            new HttpException(
              {
                message: [error.message || 'Internal Server Error'],
                error: 'Internal Server Error',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
