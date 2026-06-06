import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Url } from './url.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UrlService {
    constructor(
        @Inject('URL_REPOSITORY')
        private readonly urlRepository: Repository<Url>,
    ){}

    private readonly urls:Record <string, string>= {};

    // shortenUrl(originlUrl:string){
    //     const shortUrl= Math.random().toString(36).substring(2,8)
    //     this.urls[shortUrl]=originlUrl
    //     return shortUrl }

        async shortenUrl(originalUrl:string,userid:number){
            const shortUrl= Math.random().toString(36).substring(2,8)
            const insert= await  this.urlRepository.save({
                originalUrl,
                shortUrl:`${shortUrl}`,
                user:{
                    id:userid
                },
            })
           
            return `${shortUrl}`
        }

        async getShortUrl(shortCode:string,userid:number){
            console.log("FInding originL uRL FOR :",shortCode)
            const redirectUrl = await this.urlRepository.findOne({
                where: { shortUrl: shortCode,user:{
                    id:userid
                } },
            });

        
            console.log("AFter query",redirectUrl)
            if (!redirectUrl) {
                throw new NotFoundException('Short URL not found');
            }

            return redirectUrl.originalUrl;
        }
    
}
