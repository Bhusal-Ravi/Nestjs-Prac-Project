import { BadRequestException, Body, Controller, Get, Param, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UrlService } from './url.service';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

@Controller('url')
export class UrlController {

    
    private  username:string=""
    private  userid:number=0
    constructor(private readonly  urlService:UrlService) {}

    @Post('/shorten')
    async shorten(@Body() body:{url:string},@Res() res:Response, @Req() req:Request){

        

        const sessionToken= req.cookies.sessionToken
        
        const payload= jwt.verify(sessionToken,process.env.SECRET_KEY)

        if(!payload) throw new  UnauthorizedException( 'Not authozied to perform this action')

            console.log(payload)
        this.username=payload.username
        this.userid=payload.userid

        if(!body.url){
            throw new BadRequestException('Provide a valid Url')
        }
        const originalUrl= body.url
        const fullUrl = originalUrl.startsWith('http') ? originalUrl : `https://${originalUrl}`
        const shortUrl=  await this.urlService.shortenUrl(fullUrl,this.userid)
         console.log(shortUrl)

        return res.json({shortUrl:`http://localhost:3000/${shortUrl}`})
    }

    @Get(':shorturl')
    async getshorten(@Param('shorturl') shorturl:string,@Req() req:Request ,@Res() res:Response){

        const sessionToken= req.cookies.sessionToken
        
        const payload= jwt.verify(sessionToken,process.env.SECRET_KEY)

        if(!payload) throw new  UnauthorizedException( 'Not authozied to perform this action')

            console.log(payload)
        this.username=payload.username
        this.userid=payload.userid

        if(!shorturl){
            throw new BadRequestException('Short Url is Needed'
            )
        }

        const redirectUrl= await this.urlService.getShortUrl(shorturl,this.userid)
        return res.redirect(redirectUrl)
    }


}
