import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional } from 'class-validator';


export class PaginationDto{
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

export class CreateUpdateDriversDto{
    @ApiProperty()
    @IsString()
    public readonly name: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Image to be uploaded',
        required: false,
      })
      public readonly photo_profile: any;

}
