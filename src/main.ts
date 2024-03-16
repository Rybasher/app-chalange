import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './utils/filters/expception-filter.utils'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: [process.env.FRONT_URL],
    credentials: true
  })

  const config = new DocumentBuilder()
    .setTitle('app-challenge-api')
    .setDescription('Documentation')
    .setVersion('1.0.0')
    .addTag('Api')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header'
      },
      'token'
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document, {})

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(process.env.PORT || 8000)
  console.log(
    `Server has been started on http://localhost:${process.env.PORT || 8000}/`
  )
}
bootstrap()
