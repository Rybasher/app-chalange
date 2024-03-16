import {
  ArgumentsHost,
  BadRequestException,
  ExceptionFilter,
  HttpException,
  UnauthorizedException
} from '@nestjs/common'

export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    if (exception instanceof BadRequestException) {
      const ctx = host.switchToHttp()
      const response = ctx.getResponse()
      return response.status(exception.getStatus()).json({
        status_code: exception.getStatus(),
        detail: exception.getResponse(),
        result: 'Validation error'
      })
    }

    if (exception instanceof UnauthorizedException) {
      const ctx = host.switchToHttp()
      const response = ctx.getResponse()
      return response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        detail: exception.getResponse(),
        result: 'Token authorization error'
      })
    }

    if (exception instanceof HttpException) {
      const ctx = host.switchToHttp()
      const response = ctx.getResponse()
      return response.status(exception.getStatus()).json({
        status_code: exception.getStatus(),
        detail: exception.getResponse(),
        result: 'Error'
      })
    }
  }
}
