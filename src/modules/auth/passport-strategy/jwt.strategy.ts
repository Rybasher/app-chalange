import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import * as dotenv from 'dotenv'
import { JWTPayload } from '../interfaces/jwt.payload.interface'

dotenv.config()

@Injectable()
export class JwtStrategyAccess extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY
    })
  }
  async validate(payload: JWTPayload): Promise<JWTPayload> {
    return payload
  }
}
