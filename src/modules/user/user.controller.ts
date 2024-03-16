import { Controller, Get, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { UserToken } from 'src/utils/decorators/getUser.decorator'
import { JWTPayload } from '../auth/interfaces/jwt.payload.interface'

@Controller('user')
@ApiTags('User')
@UseGuards(AuthGuard(['jwt']))
@ApiBearerAuth('token')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get me' })
  @Get('me')
  async getMe(@UserToken() payload: JWTPayload) {
    return this.userService.getMe(payload)
  }
}
