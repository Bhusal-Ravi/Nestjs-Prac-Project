import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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

export class LocationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LocationMiddleware)
      .exclude(
        { path: 'location/allstates', method: RequestMethod.GET },
        { path: 'location/geojson', method: RequestMethod.GET },
        { path: 'location/seed-coordinates', method: RequestMethod.POST },
        { path: 'location/new-york/counties', method: RequestMethod.GET },
        { path: 'location/seed-ny-counties', method: RequestMethod.POST },
      )
      .forRoutes(LocationController);
  }
}
