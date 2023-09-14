import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddingRefreshTokenToUserTable1694712538288
  implements MigrationInterface
{
  private TABLE_NAME = 'users';
  private COLUMN_NAME = 'refresh_token';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.TABLE_NAME,
      new TableColumn({
        name: this.COLUMN_NAME,
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.TABLE_NAME, this.COLUMN_NAME);
  }
}
