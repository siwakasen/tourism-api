import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional } from 'class-validator';

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
