import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UrlModule } from './url/url.module';
import { UserModule } from './user/user.module';

import { DatabaseModule } from './database/database.module';
import { Url } from './url/url.entity';
import { StatsModule } from './stats/stats.module';


@Module({
  imports: [ UrlModule, UserModule, DatabaseModule, StatsModule],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
