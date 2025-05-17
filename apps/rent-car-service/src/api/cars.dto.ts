import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';

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

export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image to be uploaded',
  })
  public readonly image: any;
}

export class CreateUpdateCarsDto {
  @ApiProperty()
  @IsString()
  public readonly car_name: string;

  @ApiProperty()
  @IsString()
  public readonly description: string;

  @ApiProperty()
  @IsNumber()
  public readonly min_person: number;

  @ApiProperty()
  @IsNumber()
  public readonly max_person: number;

  @ApiProperty()
  @IsNumber()
  public readonly price: number;

  @ApiProperty()
  @IsArray()
  public readonly includes: string[];
}

export class updateStatusDto {
  @ApiProperty()
  @IsBoolean()
  public readonly status: boolean;
}
