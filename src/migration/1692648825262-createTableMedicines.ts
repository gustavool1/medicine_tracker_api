import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableMedicines1692648825262 implements MigrationInterface {
  private TABLE_NAME = 'medicines';

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
            isPrimary: true,
            type: 'varchar',
          },
          {
            name: 'user_id',

            type: 'varchar',
          },
          {
            name: 'frequency',
            type: 'int',
          },
          {
            name: 'until',
            type: 'datetime',
          },
        ],
        foreignKeys: [
          {
            name: 'fk_users_medicine',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.TABLE_NAME);
  }
}
