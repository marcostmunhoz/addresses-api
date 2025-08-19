import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('addresses')
export class TypeOrmAddressModel {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  number?: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 8 })
  latitude?: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 8 })
  longitude?: number;
}
