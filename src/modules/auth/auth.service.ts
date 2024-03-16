import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'

import { comparePassword } from 'src/utils/bcrypt.utils'
import { JwtService } from '@nestjs/jwt'
import { LoginDto } from './dto/user-login.dto'
import { UserService } from '../user/user.service'
import { EmailService } from 'src/modules/email/email.service'
import { RefreshTokensDto } from './dto/refresh-token.dto'
import { Tokens } from './classes/tokens.class'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { User } from '@prisma/client'
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  public async login(dto: LoginDto) {
    const user = await this._validateUser(dto)

    if (!user) {
      throw new ForbiddenException('wrong email or password')
    }

    return await this._generateTokens(user)
  }

  public async registration(userDto: CreateUserDto) {
    const user: User = await this.userService.createUser(userDto)
    return await this._generateTokens(user)
  }

  public async refreshTokens(dto: RefreshTokensDto) {
    const payload = await this.jwtService.verifyAsync(dto.token, {
      secret: process.env.JWT_REFRESH_SECRET
    })

    const user = await this.userService.getUserByEmailWithPublicFields(
      payload.email
    )

    if (!user) {
      throw new ForbiddenException('Access Denied')
    }

    return await this._generateTokens(user)
  }

  public async sendEmailForgotPassword(email: string) {
    const user = await this.userService.getUserByEmailWithPublicFields(email)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const token = await this.jwtService.signAsync(
      { email: email },
      {
        secret: process.env.EMAIL_TOKEN_SECRET,
        expiresIn: '15m'
      }
    )

    await this.emailService.sendEmailForgotPassword(token, email)
    return
  }

  public async changePassword(token: string, password: string) {
    const payload: { email: string } = await this.jwtService.verifyAsync(
      token,
      { secret: process.env.EMAIL_TOKEN_SECRET }
    )
    if (payload) {
      await this.userService.changePassword(payload.email, password)
      return
    } else {
      throw new UnauthorizedException('Access Denied')
    }
  }

  private async _generateTokens(user): Promise<Tokens> {
    const payload = {
      email: user.email
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_KEY,
        expiresIn: '15m'
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d'
      })
    ])
    return {
      accessToken,
      refreshToken
    }
  }

  private async _validateUser(userDto: LoginDto) {
    const user = await this.userService.getUserByEmail(userDto.email)

    if (!user) {
      return null
    }

    const passwordEquals = comparePassword(userDto.password, user?.password)

    if (user && passwordEquals) {
      return user
    }

    return null
  }
}
