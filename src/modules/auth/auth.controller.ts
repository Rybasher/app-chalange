import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { LoginDto } from './dto/user-login.dto'
import { JWTPayload } from './interfaces/jwt.payload.interface'
import { UserToken } from 'src/utils/decorators/getUser.decorator'
import { RefreshTokensDto } from './dto/refresh-token.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ChangePasswordDto } from './dto/change-password.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @ApiOperation({ summary: 'Registration' })
  @Post('registration')
  async registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto)
  }

  @ApiOperation({ summary: 'Refresh tokens' })
  @Post('refresh-tokens')
  async refreshTokens(@Body() body: RefreshTokensDto) {
    return this.authService.refreshTokens(body)
  }

  @ApiOperation({ summary: 'Send email to reset password' })
  @Post('forgot-password')
  async sendEmailResetPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.sendEmailForgotPassword(dto.email)
  }

  @ApiOperation({ summary: 'Reset password' })
  @Post('reset-password')
  async resetPassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(dto.token, dto.password)
  }
}
