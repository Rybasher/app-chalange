import { Module } from '@nestjs/common'
import { CollectionController } from './collection.controller'
import { CollectionService } from './collection.service'
import { UserModule } from '../user/user.module'

@Module({
  controllers: [CollectionController],
  providers: [CollectionService],
  imports: [UserModule],
  exports: [CollectionService]
})
export class CollectionModule {}
