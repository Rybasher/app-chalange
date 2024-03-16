import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length, Matches } from 'class-validator'

export class ChangePasswordDto {
  @ApiProperty({ example: '12345678', description: 'password' })
  @Length(8, 36, { message: 'password length 8-36' })
  @IsString({ message: 'must be a string' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak'
  })
  readonly password: string

  @ApiProperty({ example: 'token', description: 'Token to change password' })
  @IsString({ message: 'must be a string' })
  readonly token: string
}
