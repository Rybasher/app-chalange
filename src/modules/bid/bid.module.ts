import { Module, forwardRef } from '@nestjs/common'
import { BidService } from './bid.service'
import { BidController } from './bid.controller'
import { UserModule } from '../user/user.module'
import { CollectionModule } from '../collection/collection.module'

@Module({
  controllers: [BidController],
  providers: [BidService],
  imports: [UserModule, CollectionModule],
  exports: [BidService]
})
export class BidModule {}
