import { Global, Module } from '@nestjs/common';
import { databaseProviders } from 'src/database.providers';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [...databaseProviders, DatabaseService],
  exports: [...databaseProviders, DatabaseService],
})
export class DatabaseModule {}