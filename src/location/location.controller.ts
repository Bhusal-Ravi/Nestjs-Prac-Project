import { Body, Controller, Put } from '@nestjs/common';
import { LocationService } from './location.service';

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
}
