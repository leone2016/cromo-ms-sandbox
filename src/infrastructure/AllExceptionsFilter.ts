import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ERRORS, ErrorCode } from './ErrorEnum';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Check if it is a NestJS HttpException (AppException or standard HttpExceptions)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();

      // If it matches our custom AppException response structure
      if (typeof exceptionResponse === 'object' && exceptionResponse.code) {
        return response.status(status).json(exceptionResponse);
      }

      // If it is a standard NestJS HTTP Exception (e.g. Route Not Found 404)
      return response.status(status).json({
        code: status === HttpStatus.NOT_FOUND ? 'ROUTE_NOT_FOUND' : 'HTTP_ERROR',
        message: exception.message || (typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message),
        statusCode: status,
        metadata: {},
      });
    }

    // Unhandled generic errors (e.g. TypeErrors, db failures, syntax errors)
    console.error('Unhandled Exception:', exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: ERRORS[ErrorCode.E002].code,
      message: ERRORS[ErrorCode.E002].message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      metadata: {
        error: exception.message || String(exception),
      },
    });
  }
}
