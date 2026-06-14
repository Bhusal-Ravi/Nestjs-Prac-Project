import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LocationMiddleware } from './location.middleware';
import { LocationController } from './location.controller';
import { DatabaseModule } from 'src/database/database.module';
import { LocationService } from './location.service';


@Module({
  imports: [DatabaseModule],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})

@Module({})
export class LocationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LocationMiddleware).forRoutes(LocationController);
  }
}
