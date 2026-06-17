import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Url } from './url.entity';
import { StatsService } from 'src/stats/stats.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UrlService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly statsService:StatsService
    ){}

    private readonly urls:Record <string, string>= {};

    

    // shortenUrl(originlUrl:string){
    //     const shortUrl= Math.random().toString(36).substring(2,8)
    //     this.urls[shortUrl]=originlUrl
    //     return shortUrl }

    async shortenUrl(originalUrl:string,userid:number,locationId:number){
            const shortUrl= Math.random().toString(36).substring(2,8)
            
            console.log(locationId,"locationID")
            const urlRepository =
                  this.databaseService.getEntityRepository(              
                    Url,
                  );

            const insert= await  urlRepository.save({
                originalUrl,
                shortUrl:`${shortUrl}`,
                location: {
                    id:locationId
                },
                user:{
                    id:userid
                },
            })
            console.log(insert)
            const url_id= insert.id
            const setStats= await this.statsService.setStats(userid,url_id)
            console.log(setStats)
            return `${shortUrl}`
        }



    async getShortUrl(shortCode:string,userid:number){
            console.log("FInding originL Url FOR :",shortCode)
                  

             const urlRepository =
                  this.databaseService.getEntityRepository(                     
                    Url,
                  );


            const redirectUrl = await urlRepository.findOne({
                where: { shortUrl: shortCode,user:{
                    id:userid
                } },
            });
            
            if(!redirectUrl) throw new UnauthorizedException('Not allowed to perform this action')
            const url_id= redirectUrl?.id
            console.log(url_id)

            if(!url_id)  throw new BadRequestException('Could not update stats')

            const updateUrl= await this.statsService.updateStats(userid,url_id)
            
        
            console.log("AFter query",redirectUrl)
            if (!redirectUrl) {
                throw new NotFoundException('Short URL not found');
            }

            return redirectUrl.originalUrl;
        }

        async bulkData(bulkdata:{userId:number,data:{url:string,locationId:number}[]}){
            const urlRepository =
                  this.databaseService.getEntityRepository(                     
                    Url,
                  );

                let urlArray={}
            if(!bulkdata) throw new BadRequestException('Provide required data at bulk url data insert')
            
            if(!Array.isArray(bulkdata.data)) throw new BadRequestException('Data needs to be an array')
           
                
                const data= bulkdata.data
                const userId=bulkdata.userId

                await Promise.all(
             data.map(async (item,index)=>{
                const shortUrl= Math.random().toString(36).substring(2,8)

                const insert= await  urlRepository.save({
                originalUrl:item.url,
                shortUrl:`${shortUrl}`,
                location: {
                    id:item.locationId
                },
                user:{
                    id:userId
                },
            })

            const url_id= insert.id
            const setStats= await this.statsService.setStats(userId,url_id)
            urlArray[shortUrl]=item.url

            })
        )
            
            return urlArray

        }
    
}
