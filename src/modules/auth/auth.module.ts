import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategyAccess } from './passport-strategy/jwt.strategy'
import { UserModule } from '../user/user.module'
import { EmailModule } from '../email/email.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategyAccess],
  imports: [
    UserModule,
    EmailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_KEY
      })
    })
  ],
  exports: [PassportModule, JwtStrategyAccess]
})
export class AuthModule {}
