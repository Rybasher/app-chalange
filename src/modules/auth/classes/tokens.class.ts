import { ApiProperty } from '@nestjs/swagger'

export class Tokens {
  @ApiProperty({ example: '', description: 'access jwt token' })
  readonly accessToken: string

  @ApiProperty({ example: '', description: 'refresh jwt token' })
  readonly refreshToken: string
}
