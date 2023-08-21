import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class MakingUsersEmailUnique1692630036871 implements MigrationInterface {
  private TABLE_NAME = 'users';
  private COLUMN_NAME = 'email';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      this.COLUMN_NAME,
      new TableColumn({
        name: this.COLUMN_NAME,
        type: 'varchar',
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.TABLE_NAME,
      this.COLUMN_NAME,
      new TableColumn({
        name: this.COLUMN_NAME,
        type: 'varchar',
        isUnique: false,
      }),
    );
  }
}
