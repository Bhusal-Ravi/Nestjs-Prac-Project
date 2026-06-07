import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { UserMiddleware } from './user.middleware';

@Module({
  imports:[DatabaseModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
  consumer
  .apply (UserMiddleware)
  .forRoutes(UserController)
  }
}
