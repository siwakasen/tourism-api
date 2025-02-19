import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('drivers')
export class Drivers {
  @ApiProperty({
    description: 'The unique identifier for the testimonial',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the driver',
    example: 'John Doe',
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'The photo profile of the driver',
    example: 'John Doe',
  })
  @Column({ type: 'varchar', length: 255 })
  photo_profile: string;

  @ApiProperty({
    description: 'The timestamp when the tour package was created',
    example: '2024-11-18T12:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'The timestamp when the tour package was last updated',
    example: '2024-11-19T12:00:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({
    description: 'The timestamp when the tour package was soft-deleted',
    example: '2024-11-20T12:00:00.000Z',
    nullable: true,
  })
  @DeleteDateColumn()
  deleted_at: Date;
}
