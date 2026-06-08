import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

@Injectable()
export class StatsMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if(!req.cookies.sessionToken) throw new UnauthorizedException("Not authorized to perform this action")

    const sessionToken= req.cookies.sessionToken

    const payload= jwt.verify(sessionToken,process.env.SECRET_KEY)

    if(!payload) throw new  UnauthorizedException( 'Not authozied to perform this action')

    req.payload=payload

    next();
  }
}
