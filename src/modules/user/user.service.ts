import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { encodePassword } from 'src/utils/bcrypt.utils'
import { PrismaClient, User } from '@prisma/client'
import { JWTPayload } from '../auth/interfaces/jwt.payload.interface'

@Injectable()
export class UserService {
  constructor() {}
  private prisma: PrismaClient = new PrismaClient()
  private readonly logger = new Logger('Change db')

  public async createUser(dto: CreateUserDto) {
    if (await this.getUserByEmailWithPublicFields(dto.email)) {
      throw new BadRequestException('User with this email already exists')
    }

    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: encodePassword(dto.password)
      }
    })

    this.logger.log(`Create new user`)
    return newUser
  }

  public async getMe(payload: JWTPayload) {
    const user = await this.getUserByEmailWithPublicFields(payload.email)

    if (!user) {
      throw new ForbiddenException('Access Denied')
    }

    return user
  }

  public async getUserByEmailWithPublicFields(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  public async changePassword(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (user) {
      const hashPassword = encodePassword(password)
      await this.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          password: hashPassword
        }
      })

      return true
    } else {
      throw new Error('User not found')
    }
  }
}
