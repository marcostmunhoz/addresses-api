import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('addresses')
export class TypeOrmAddressModel {
  @PrimaryColumn({ length: 36 })
  id: string;

  @Column({ length: 8, name: 'zip_code' })
  zipCode: string;

  @Column({ length: 2 })
  state: string;

  @Column({ length: 255 })
  city: string;

  @Column({ length: 255 })
  district: string;

  @Column({ length: 255, nullable: true })
  street?: string;

  @Column({ length: 255, nullable: true })
  number?: string;

  @Column({ nullable: true, type: 'decimal', precision: 8, scale: 6 })
  latitude?: number;

  @Column({ nullable: true, type: 'decimal', precision: 9, scale: 6 })
  longitude?: number;
}
