import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class CreateBidDto {
  @ApiProperty({ example: 100, description: 'The price of the bid' })
  @IsNumber()
  price: number
}
