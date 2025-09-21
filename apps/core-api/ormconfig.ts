import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { entities } from './src/entities';

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_DATABASE', 'expedientes_db'),
  entities: entities,
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});