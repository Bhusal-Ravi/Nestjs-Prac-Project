import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UrlModule } from './url/url.module';
import { UserModule } from './user/user.module';

import { DatabaseModule } from './database/database.module';
import { StatsModule } from './stats/stats.module';
import { LocationModule } from './location/location.module';


@Module({
  imports: [ UrlModule, UserModule, DatabaseModule, StatsModule, LocationModule],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
