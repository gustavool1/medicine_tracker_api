import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddingTakePillHour1693505273200 implements MigrationInterface {
  private TABLE_NAME = 'pills';
  private TABLE_COLUMN = 'take_pill_hour';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.TABLE_NAME,
      new TableColumn({
        name: this.TABLE_COLUMN,
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.TABLE_NAME, this.TABLE_COLUMN);
  }
}
