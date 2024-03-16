import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Bid, PrismaClient, StatusType } from '@prisma/client'
import { CreateBidDto } from './dto/create-bid.dto'
import { UpdateBitDto } from './dto/update-bit.dto'
import { JWTPayload } from '../auth/interfaces/jwt.payload.interface'
import { UserService } from '../user/user.service'
import { CollectionService } from '../collection/collection.service'

@Injectable()
export class BidService {
  constructor(
    private readonly userService: UserService,
    private readonly collectionService: CollectionService
  ) {}

  private prisma: PrismaClient = new PrismaClient()

  async getBidsByCollection(collectionId: number): Promise<Bid[]> {
    const collection =
      await this.collectionService.findCollectionById(collectionId)

    if (!collection) {
      throw new ForbiddenException('Collection not found')
    }
    return this.prisma.bid.findMany({
      where: { collectionId }
    })
  }

  async createBid(
    data: CreateBidDto,
    collectionId: number,
    payload: JWTPayload
  ): Promise<Bid> {
    const user = await this.userService.getUserByEmail(payload.email)

    if (!user) {
      throw new ForbiddenException('User not found')
    }

    const collection =
      await this.collectionService.findCollectionById(collectionId)

    if (!collection) {
      throw new ForbiddenException('Collection not found')
    }

    const acceptedBidInCollection = await this.prisma.bid.findFirst({
      where: {
        collectionId: collectionId,
        status: StatusType.ACCEPTED
      }
    })

    if (acceptedBidInCollection) {
      throw new ForbiddenException('Collection already has an accepted bid')
    }

    const bid = await this.prisma.bid.create({
      data: {
        ...data,
        status: 'PENDING',
        collection: { connect: { id: collection.id } },
        user: { connect: { id: user.id } }
      }
    })

    return bid
  }

  async updateBid(
    id: number,
    data: UpdateBitDto,
    payload: JWTPayload
  ): Promise<Bid> {
    const user = await this.userService.getUserByEmail(payload.email)
    if (!user) {
      throw new ForbiddenException('User not found')
    }

    const bid = await this.prisma.bid.findUnique({
      where: { id }
    })

    if (!bid) {
      throw new ForbiddenException('Bid not found')
    }

    if (bid.userId !== user.id) {
      throw new ForbiddenException('User is not the owner of the bid')
    }

    return this.prisma.bid.update({
      where: { id },
      data
    })
  }

  async deleteBid(id: number, payload: JWTPayload): Promise<void> {
    const user = await this.userService.getUserByEmail(payload.email)

    if (!user) {
      throw new ForbiddenException('User not found')
    }

    const bid = await this.prisma.bid.findUnique({
      where: { id }
    })

    if (!bid) {
      throw new NotFoundException('Bid not found')
    }

    if (bid.userId !== user.id) {
      throw new ForbiddenException('User is not the owner of the bid')
    }

    await this.prisma.bid.delete({ where: { id } })
  }

  async acceptBid(
    collectionId: number,
    bidId: number,
    payload: JWTPayload
  ): Promise<void> {
    const user = await this.userService.getUserByEmail(payload.email)
    if (!user) {
      throw new ForbiddenException('User not found')
    }

    const collection =
      await this.collectionService.findCollectionById(collectionId)

    if (!collection) {
      throw new ForbiddenException('Collection not found')
    }

    if (user.id !== collection.userId) {
      throw new ForbiddenException('You cannot accept bit for this collection')
    }

    // Begin a transaction
    await this.prisma.$transaction(async (prisma) => {
      // Update the status of the accepted bid
      await prisma.bid.update({
        where: { id: bidId },
        data: { status: StatusType.ACCEPTED }
      })

      // Reject all other bids for the collection
      await prisma.bid.updateMany({
        where: {
          collectionId,
          NOT: {
            id: bidId
          }
        },
        data: { status: StatusType.REJECTED }
      })
    })
    return
  }

  async rejectBid(
    collectionId: number,
    bidId: number,
    payload: JWTPayload
  ): Promise<void> {
    const user = await this.userService.getUserByEmail(payload.email)
    if (!user) {
      throw new ForbiddenException('User not found')
    }

    const collection =
      await this.collectionService.findCollectionById(collectionId)

    if (!collection) {
      throw new ForbiddenException('Collection not found')
    }

    if (user.id !== collection.userId) {
      throw new ForbiddenException('You cannot accept bit for this collection')
    }

    await this.prisma.bid.update({
      where: { id: bidId },
      data: { status: StatusType.REJECTED }
    })

    return
  }
}
