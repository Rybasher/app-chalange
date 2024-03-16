import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber } from 'class-validator'
import { StatusType } from '@prisma/client'

export class CreateBidDto {
  @ApiProperty({ example: 100, description: 'The price of the bid' })
  @IsNumber()
  price: number

  @ApiProperty({
    example: 'PENDING',
    description: 'The status of the bid',
    enum: StatusType
  })
  @IsEnum(StatusType)
  status: StatusType
}
