import { BadRequestException, Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UrlService } from './url.service';

type AuthRequest = Request &  {
    payload?:{
        username:string,
        userid:number,
        region:string,
        
    }
}

@Controller('url')
export class UrlController {
    constructor(private readonly  urlService:UrlService) {}

    @Post('/shorten')
    async shorten(@Body() body:{url:string,locationId:number},@Res() res:Response, @Req() req:AuthRequest){

        const payload= req.payload
        if(!payload || !payload.userid || !payload.username) throw new BadRequestException("Provide necessary information")
        
        
        
        

        if(!body.url){
            throw new BadRequestException('Provide a valid Url')
        }
        const originalUrl= body.url
        const fullUrl = originalUrl.startsWith('http') ? originalUrl : `https://${originalUrl}`
        
        const shortUrl=  await this.urlService.shortenUrl(fullUrl,payload.userid,body.locationId)
         console.log(shortUrl)

        return res.json({shortUrl:`http://localhost:3000/${shortUrl}`})
    }

    @Get(':shorturl')
    async getshorten(@Param('shorturl') shorturl:string,@Req() req:Request ,@Res() res:Response){

        const payload= (req as AuthRequest).payload

        if(!payload) throw new BadRequestException( 'Provide necessary information')

            console.log(payload)

        if(!shorturl){
            throw new BadRequestException('Short Url is Needed'
            )
        }

        const redirectUrl= await this.urlService.getShortUrl(shorturl,payload.userid)
        return res.redirect(redirectUrl)
    }

    @Post('/bulkdata')
    async bulkdata(@Body() body:{url:string,locationId:number}[],@Res() res:Response, @Req() req:AuthRequest){
        const payload= req.payload
        if(!payload || !payload.userid || !payload.username) throw new BadRequestException("Provide necessary information")
        
        
        const bulkInsert= await this.urlService.bulkData({userId:payload.userid,data:body})
        return res.json(bulkInsert)
    }


}
