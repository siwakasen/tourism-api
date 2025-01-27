import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsEmail } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ default: 1 })
  @IsNumber()
  @Type(() => Number)
  public readonly page: number;

  @ApiProperty({ default: 10 })
  @IsNumber()
  @Type(() => Number)
  public readonly limit: number;

  @ApiProperty({ default: '', required: false })
  @IsString()
  @IsOptional()
  public readonly search: string;
}

export class requestOrderCarRentalDto {
  @ApiProperty()
  @IsString()
  public readonly car_id: string;

  @ApiProperty()
  @IsString()
  public readonly name: string;

  @ApiProperty()
  @IsEmail()
  public readonly email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly country_of_origin: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly phone_number: string;

  @ApiProperty()
  @IsNumber()
  public readonly number_of_person: number;

  @ApiProperty()
  @IsString()
  public readonly pickup_location: string;

  @ApiProperty({
    type: 'string',
    description: 'Date format: YYYY-MM-DD',
  })
  @IsString()
  public readonly start_date: string;

  @ApiProperty({
    type: 'string',
    description: 'Date format: YYYY-MM-DD',
  })
  @IsString()
  public readonly end_date: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly pickup_time: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly additional_message: string;
}
