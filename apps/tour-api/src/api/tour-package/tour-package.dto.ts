import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsArray } from 'class-validator';

//set up pagination + filter untuk fetch data staff
export class PaginationDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  public readonly page: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  public readonly limit: number;

  @ApiProperty({ default: '', required: false })
  @IsString()
  @IsOptional()
  public readonly search: string;
}

export class CreateTourPackageDto {
  @ApiProperty()
  @IsString()
  public readonly package_name: string;

  @ApiProperty()
  @IsString()
  public readonly description: string;

  @ApiProperty()
  @IsArray()
  public readonly images: string[];

  @ApiProperty()
  @IsNumber()
  public readonly package_price: number;

  @ApiProperty()
  @IsNumber()
  public readonly duration: number;

  @ApiProperty()
  @IsNumber()
  public readonly max_group_size: number;

  @ApiProperty()
  @IsNumber()
  public readonly children_price: number;

  @ApiProperty()
  @IsArray()
  public readonly itineraries: string[];

  @ApiProperty()
  @IsArray()
  public readonly includes: string[];

  @ApiProperty()
  @IsArray()
  public readonly pickup_areas: string[];

  @ApiProperty()
  @IsArray()
  public readonly terms_conditions: string[];
}
