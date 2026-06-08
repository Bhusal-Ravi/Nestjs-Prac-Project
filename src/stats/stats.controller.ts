import { BadRequestException, Body, Controller, Put, Req, Res } from '@nestjs/common';
import { StatsService } from './stats.service';
import type { Request, Response } from 'express';

type AuthRequest = Request & {
    payload?: {
        username: string,
        userid: number,
        region: string,
    }
}

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService:StatsService){}

    @Put('/getstats')
    async getStats (@Body() body:{url_id:number}, @Req() req:AuthRequest, @Res() res:Response ){
                const payload= req.payload
                if(!payload) throw new BadRequestException('Provide necessary information')

                const user_id= payload.userid
                const url_id= body.url_id

                
            const stats= await this.statsService.getStats(user_id,url_id,payload.region)

            console.log(stats)
            return res.json(stats)
    }

     @Put('/updatestats')
    async updateStats (@Body() body:{url_id:number}, @Req() req:AuthRequest, @Res() res:Response ){
                const payload= req.payload
                if(!payload) throw new BadRequestException('Provide necessary information')

                const user_id= payload.userid
                const url_id= body.url_id

                
            const update= await this.statsService.updateStats(user_id,url_id,payload.region)

            console.log(update)
            return res.json({success:true})
    }
    

    @Put('/setstats')
    async setStats(@Body() body:{url_id:number}, @Req() req:AuthRequest, @Res() res:Response){
         const payload= req.payload
         if(!payload) throw new BadRequestException('Provide necessary information')

         const user_id= payload.userid
         const url_id= body.url_id

         const set= await this.statsService.setStats(user_id,url_id,payload.region)
         return res.json(set)
    }



}
