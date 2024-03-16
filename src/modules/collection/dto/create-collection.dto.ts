import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

export class CreateCollectionDto {
  @ApiProperty({
    example: 'Vintage Posters',
    description: 'The name of the collection'
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: 'A collection of vintage posters from the 1920s',
    description: 'Description of the collection'
  })
  @IsString()
  @IsNotEmpty()
  descriptions: string

  @ApiProperty({
    example: 100,
    description: 'The number of items available in the collection'
  })
  @IsNumber()
  @Min(0)
  stocks: number

  @ApiProperty({
    example: 19.99,
    description: 'The price of each item in the collection'
  })
  @IsNumber()
  price: number
}
