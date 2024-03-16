import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BidService } from './bid.service'
import { Bid } from '@prisma/client'
import { CreateBidDto } from './dto/create-bid.dto'
import { UpdateBitDto } from './dto/update-bit.dto'
import { AuthGuard } from '@nestjs/passport'
import { UserToken } from 'src/utils/decorators/getUser.decorator'
import { JWTPayload } from '../auth/interfaces/jwt.payload.interface'

@Controller('bid')
@ApiTags('Bid')
@UseGuards(AuthGuard(['jwt']))
@ApiBearerAuth('token')
export class BidController {
  constructor(private bidService: BidService) {}

  @Get(':collectionId')
  @ApiOperation({ summary: 'Get bids by collection id' })
  async getBidsByCollection(
    @Param('collectionId') collectionId: string
  ): Promise<Bid[]> {
    return this.bidService.getBidsByCollection(+collectionId)
  }

  @Post(':collectionId')
  @ApiOperation({ summary: 'Create bid' })
  async createBid(
    @UserToken() payload: JWTPayload,
    @Param('collectionId') collectionId: string,
    @Body() bidData: CreateBidDto
  ): Promise<Bid> {
    return this.bidService.createBid(bidData, +collectionId, payload)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update bid' })
  async updateBid(
    @UserToken() payload: JWTPayload,
    @Param('id') id: string,
    @Body() bidData: UpdateBitDto
  ): Promise<Bid> {
    return this.bidService.updateBid(+id, bidData, payload)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete bid' })
  async deleteBid(
    @Param('id') id: string,
    @UserToken() payload: JWTPayload
  ): Promise<void> {
    return this.bidService.deleteBid(+id, payload)
  }

  @Post('accept/:collectionId/:bidId')
  @ApiOperation({ summary: 'Accept bid' })
  async acceptBid(
    @Param('collectionId') collectionId: string,
    @Param('bidId') bidId: string,
    @UserToken() payload: JWTPayload
  ): Promise<void> {
    return this.bidService.acceptBid(+collectionId, +bidId, payload)
  }

  @Post('reject/:collectionId/:bidId')
  @ApiOperation({ summary: 'Reject bid' })
  async rejectBid(
    @Param('collectionId') collectionId: string,
    @Param('bidId') bidId: string,
    @UserToken() payload: JWTPayload
  ): Promise<void> {
    return this.bidService.rejectBid(+collectionId, +bidId, payload)
  }
}
