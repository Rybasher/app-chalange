import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailForgotPassword(token: string, email: string) {
    const verifUrl = `${process.env.FRONT_URL}/auth/forgot-password?token=${token}`
    await this.mailerService.sendMail({
      to: email,
      subject: 'Forgot passwrod',
      template: './forgotpassword',
      context: {
        verifUrl: verifUrl
      }
    })
  }
}
