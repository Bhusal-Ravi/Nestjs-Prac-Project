import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Url } from './url.entity';
import { Repository } from 'typeorm';
import { StatsService } from 'src/stats/stats.service';

@Injectable()
export class UrlService {
    constructor(
        @Inject('URL_REPOSITORY')
        private readonly urlRepository: Repository<Url>,

        @Inject('USA_URL_REPOSITORY')
        private readonly usaUrlRepository: Repository<Url>,

        private readonly statsService:StatsService
    ){}

    private readonly urls:Record <string, string>= {};

    private getUrlRepository(region?: string) {
        return region === 'usa' ? this.usaUrlRepository : this.urlRepository;
    }

    // shortenUrl(originlUrl:string){
    //     const shortUrl= Math.random().toString(36).substring(2,8)
    //     this.urls[shortUrl]=originlUrl
    //     return shortUrl }

        async shortenUrl(originalUrl:string,userid:number,region?:string){
            const shortUrl= Math.random().toString(36).substring(2,8)
            const repository = this.getUrlRepository(region)

            const insert= await  repository.save({
                originalUrl,
                shortUrl:`${shortUrl}`,
                user:{
                    id:userid
                },
            })

            const url_id= insert.id
            const setStats= await this.statsService.setStats(userid,url_id,region)
            console.log(setStats)
            return `${shortUrl}`
        }

        async getShortUrl(shortCode:string,userid:number,region?:string){
            console.log("FInding originL Url FOR :",shortCode)
            const repository = this.getUrlRepository(region)

            const redirectUrl = await repository.findOne({
                where: { shortUrl: shortCode,user:{
                    id:userid
                } },
            });
            
            const url_id= redirectUrl?.id

            if(!url_id)  throw new BadRequestException('Could not update stats')

            const updateUrl= await this.statsService.updateStats(userid,url_id,region)
            
        
            console.log("AFter query",redirectUrl)
            if (!redirectUrl) {
                throw new NotFoundException('Short URL not found');
            }

            return redirectUrl.originalUrl;
        }
    
}
