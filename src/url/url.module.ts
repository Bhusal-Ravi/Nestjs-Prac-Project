import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { DatabaseModule } from '../database/database.module';
import { UrlMiddleware } from './url.middleware';
import { StatsModule } from 'src/stats/stats.module';

@Module({
  imports: [DatabaseModule, StatsModule],
  controllers: [UrlController],
  providers: [UrlService]
})
export class UrlModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    
      consumer
      .apply(UrlMiddleware)
      .forRoutes(UrlController)
    }
  }


