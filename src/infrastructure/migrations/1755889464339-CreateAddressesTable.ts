import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAddressesTable1755889464339 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'zip_code',
            type: 'char',
            length: '8',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'char',
            length: '2',
            isNullable: false,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'district',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'street',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'number',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'latitude',
            type: 'decimal',
            precision: 8,
            scale: 6,
            isNullable: true,
          },
          {
            name: 'longitude',
            type: 'decimal',
            precision: 9,
            scale: 6,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'addresses',
      new TableIndex({
        name: 'idx_required_address_fields',
        columnNames: ['zip_code', 'state', 'city', 'district'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('addresses', 'idx_required_address_fields');
    await queryRunner.dropTable('addresses', true);
  }
}
