import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {

    if(!req.cookie){
      throw new Error ('Not authenticated for this process')
    }



    next();
  }
}
