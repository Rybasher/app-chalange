import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CollectionService } from './collection.service'
import { Collection } from '@prisma/client'
import { CreateCollectionDto } from './dto/create-collection.dto'
import { UpdateCollectionDto } from './dto/update-collection.dto'
import { AuthGuard } from '@nestjs/passport'
import { UserToken } from 'src/utils/decorators/getUser.decorator'
import { JWTPayload } from '../auth/interfaces/jwt.payload.interface'

@Controller('collection')
@ApiTags('Collection')
@UseGuards(AuthGuard(['jwt']))
@ApiBearerAuth('token')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all collections' })
  async getAllCollections(@Query('page') page: number) {
    return this.collectionService.getAllCollections(+page)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get collection by id' })
  async getCollectionById(@Param('id') id: string): Promise<Collection> {
    return this.collectionService.getCollectionById(+id)
  }

  @Post()
  @ApiOperation({ summary: 'Create collection' })
  async createCollection(
    @UserToken() payload: JWTPayload,
    @Body() collectionData: CreateCollectionDto
  ): Promise<Collection> {
    return this.collectionService.createCollection(collectionData, payload)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update collection' })
  async updateCollection(
    @UserToken() payload: JWTPayload,
    @Param('id') id: string,
    @Body() collectionData: UpdateCollectionDto
  ): Promise<Collection> {
    return this.collectionService.updateCollection(+id, collectionData, payload)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete collection' })
  async deleteCollection(
    @UserToken() payload: JWTPayload,
    @Param('id') id: string
  ) {
    return this.collectionService.deleteCollection(+id, payload)
  }
}
