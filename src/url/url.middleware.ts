import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()




@Injectable()
export class UrlMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {

    if(!req.cookies.sessionToken) throw new UnauthorizedException("Not authorized to perform this action")

    const sessionToken= req.cookies.sessionToken

    const secretKey = process.env.SECRET_KEY

    if (!secretKey) {
      throw new UnauthorizedException('JWT secret is not configured')
    }

    const payload = jwt.verify(sessionToken, secretKey)
    
    if (!payload || typeof payload === 'string') {
      throw new UnauthorizedException('Not authozied to perform this action')
    }
    
    req.payload = payload as JwtPayload
    req.region = (payload as JwtPayload).region

    next();
  }
}
