import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { PrismaClient, Collection, Prisma } from '@prisma/client'
import { JWTPayload } from '../auth/interfaces/jwt.payload.interface'
import { UserService } from '../user/user.service'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { UpdateCollectionDto } from './dto/update-collection.dto'

@Injectable()
export class CollectionService {
  constructor(private readonly userService: UserService) {}

  private prisma: PrismaClient = new PrismaClient()

  async getAllCollections(): Promise<Collection[]> {
    return this.prisma.collection.findMany()
  }

  async getCollectionById(collectionId: number): Promise<Collection> {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId }
    })
    if (!collection) {
      throw new NotFoundException('Collection not found')
    }
    return collection
  }

  async createCollection(
    data: CreateCollectionDto,
    payload: JWTPayload
  ): Promise<Collection> {
    const user = await this.userService.getUserByEmail(payload.email)

    return this.prisma.collection.create({
      data: { ...data, user: { connect: { id: user.id } } }
    })
  }

  async updateCollection(
    id: number,
    data: UpdateCollectionDto,
    payload: JWTPayload
  ): Promise<Collection> {
    const user = await this.userService.getUserByEmail(payload.email)

    if (!user) {
      throw new ForbiddenException()
    }

    const collection = await this.findCollectionById(id)

    if (!collection) {
      throw new NotFoundException('Collection not found')
    }

    if (user.id !== collection.userId) {
      throw new ForbiddenException('You cannot update this collection')
    }

    try {
      return await this.prisma.collection.update({
        where: { id },
        data
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findCollectionById(id: number): Promise<Collection> {
    return await this.prisma.collection.findUnique({ where: { id } })
  }

  async deleteCollection(id: number, payload: JWTPayload) {
    const user = await this.userService.getUserByEmail(payload.email)

    if (!user) {
      throw new ForbiddenException()
    }

    const collection = await this.findCollectionById(id)

    if (!collection) {
      throw new NotFoundException('Collection not found')
    }

    if (user.id !== collection.userId) {
      throw new ForbiddenException('You cannot update this collection')
    }

    try {
      await this.prisma.collection.delete({ where: { id } })
    } catch (error) {
      throw new BadRequestException(
        'You cannot delete this collection, it has bids associated with it.'
      )
    }
    return
  }
}
