import { Body, Controller, Get, Put, Res } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService:StatsService){}

    @Put('/getstats')
    async getStats (@Body() body:{user_id:number,url_id:number}, @Res() res:Response ){
                const user_id= body.user_id
                const url_id= body.url_id

                
            const stats= await this.statsService.getStats(user_id,url_id)

            console.log(stats)
    }

     @Put('/updatestats')
    async updateStats (@Body() body:{user_id:number,url_id:number}, @Res() res:Response ){
                const user_id= body.user_id
                const url_id= body.url_id

                
            const update= await this.statsService.updateStats(user_id,url_id)

            console.log(update)
    }
    

    @Put('/setstats')
    async setStats(@Body() body:{user_id:number,url_id:number}, @Res() res:Response){
         const user_id= body.user_id
         const url_id= body.url_id

         const set= await this.statsService.setStats(user_id,url_id)
    }



}
