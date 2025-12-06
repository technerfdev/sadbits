import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';

@Catch()
export class GlobalHTTPException implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let error = 'Exception';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionRes = exception.getResponse();

      if (typeof exceptionRes === 'object') {
        message =
          'message' in exceptionRes
            ? (exceptionRes['message'] as string)
            : 'Internal Server Error';

        error =
          'error' in exceptionRes
            ? (exceptionRes['error'] as string)
            : 'Exception';
      }
    }

    // TODO: expose exception to 3rd
    response.status(status).json({
      success: false,
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
