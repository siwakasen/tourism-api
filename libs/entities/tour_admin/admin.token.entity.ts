import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class AdminToken extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ApiProperty()
  @Column({ type: 'text' })
  token: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  used: boolean;

  @ApiProperty()
  @Column({ type: 'timestamp', default: new Date() })
  createdAt: Date;
}

export { AdminToken };
