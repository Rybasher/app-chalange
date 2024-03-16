import { ApiProperty } from '@nestjs/swagger'

export class RefreshTokensDto {
  @ApiProperty({ example: '', description: 'Refresh jwt token' })
  readonly token: string
}
