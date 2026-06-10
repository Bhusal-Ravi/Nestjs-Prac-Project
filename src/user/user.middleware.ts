import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    


    req.region=req.body.region
    console.log('User Middleware reached')



    next();
  }
}
