import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class ForgotPasswordDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  @IsEmail({}, { message: 'must be a email' })
  @IsString({ message: 'must be a string' })
  readonly email: string
}
