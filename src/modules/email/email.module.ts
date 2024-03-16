import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { join } from 'path'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'

@Module({
  providers: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.SMTP_MAIL_HOST,
          port: Number(process.env.SMTP_MAIL_HOST_PORT),
          ignoreTLS: true,
          secure: true,
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
          }
        },
        defaults: {
          from: `"APP CHALLENGE" <${process.env.SMTP_USERNAME}>`
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false
          }
        }
      })
    })
  ],
  exports: [EmailService]
})
export class EmailModule {}
