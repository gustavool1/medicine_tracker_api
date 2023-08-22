import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePillsTable1692713613027 implements MigrationInterface {
  private TABLE_NAME = 'pills';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.TABLE_NAME,
        columns: [
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar', // Change 'string' to 'varchar'
            isNullable: false, // You can specify if the column can be null or not
          },
          {
            name: 'is_taken',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'take_pill_day',
            type: 'date',
          },
          {
            name: 'medicine_id',
            type: 'varchar',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['medicine_id'],
            referencedTableName: 'medicines',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            name: 'fk_pills_medicine',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME);
  }
}
