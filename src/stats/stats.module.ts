import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { StatsMiddleware } from './stats.middleware';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService]
})
export class StatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply (StatsMiddleware)
    .forRoutes(StatsController)
  }

}
