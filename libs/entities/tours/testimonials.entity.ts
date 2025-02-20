import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('testimonials')
export class Testimonials {
  @ApiProperty({
    description: 'The unique identifier for the testimonial',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the testimonial',
    example: 'John Doe',
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'The image of the testimonial',
    example: 'John Doe',
  })
  @Column({ type: 'varchar', length: 255 })
  image: string;

  @ApiProperty({
    description: 'The message of the testimonial',
    example: 'Great experience with the tour package!',
  })
  @Column({ type: 'varchar' })
  message: string;

  @ApiProperty({
    description: 'The country of the testimonial',
    example: 'Indonesia',
  })
  @Column({ type: 'varchar', length: 255 })
  country: string;

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
