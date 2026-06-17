import { Body, Controller, Get, Post, Put, Res } from '@nestjs/common';
import { LocationService } from './location.service';
import type { Response } from 'express';

@Controller('location')
export class LocationController {

    constructor (private readonly locationservice:LocationService){}


    @Put('/data')
    async insertlocation(@Body() body:{name:string,type:'country'| 'state'|'county'|'city',parent:'string'}){
            await this.locationservice.insertlocation(body)
            
    }


    @Put('/bulkdata')
    async bulkinsertlocation(@Body() body:[{name:string,type:'country'| 'state'|'county'|'city',parent:'string'}]){
            await this.locationservice.bulkInsert(body)
            
    }

    @Get('/allstates')
    async getlocation(@Res() res:Response){
       const result= await this.locationservice.getlocation() 
       

       return res.json(result)
    
    }

    @Get('/geojson')
    async getGeoJson(@Res() res: Response) {
        const result = await this.locationservice.getGeoJson();
        return res.json(result);
    }

    @Post('/seed-coordinates')
    async seedCoordinates(@Res() res: Response) {
        const result = await this.locationservice.seedCoordinates();
        return res.json({ success: true, ...result });
    }

    @Get('/new-york/counties')
    async getNyCountyUrls(@Res() res: Response) {
        const result = await this.locationservice.getNyCountyUrls();
        return res.json(result);
    }

    @Post('/seed-ny-counties')
    async seedNyCounties(@Res() res: Response) {
        const result = await this.locationservice.seedNyCounties();
        return res.json({ success: true, ...result });
    }
}
