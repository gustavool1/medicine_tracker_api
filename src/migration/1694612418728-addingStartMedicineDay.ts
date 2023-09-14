import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddingStartMedicineDay1694612418728 implements MigrationInterface {
  private TABLE_NAME = 'medicines';
  private COLUMN_NAME = 'start_date';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.TABLE_NAME,
      new TableColumn({
        name: this.COLUMN_NAME,
        type: 'datetime',
        default: 'CURRENT_TIMESTAMP',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.TABLE_NAME, this.COLUMN_NAME);
  }
}
