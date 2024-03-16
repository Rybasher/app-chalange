import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length, Matches } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ example: 'User', description: 'User name' })
  @IsString()
  readonly name: string

  @ApiProperty({ example: 'example@gmail.com', description: 'User email' })
  @IsString()
  @IsEmail()
  readonly email: string

  @ApiProperty({ example: '12345678', description: 'password' })
  @IsString()
  @Length(8, 36, { message: 'password length 8-36' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak'
  })
  readonly password: string
}
