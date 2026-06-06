import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UrlModule } from './url/url.module';
import { UserModule } from './user/user.module';

import { DatabaseModule } from './database/database.module';
import { Url } from './url/url.entity';


@Module({
  imports: [ UrlModule, UserModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
