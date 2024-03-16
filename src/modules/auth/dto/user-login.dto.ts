import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length, Matches } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  @IsEmail({}, { message: 'Must be a email' })
  @IsString({ message: 'Must be a string' })
  readonly email: string

  @ApiProperty({ example: '12345678', description: 'Password' })
  @Length(8, 36, { message: 'Password length 8-36' })
  @IsString({ message: 'Must be a string' })
  readonly password: string
}
