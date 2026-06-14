import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Location } from './location.entity';
import { QueryBuilder } from 'typeorm';

@Injectable()
export class LocationService {
    constructor (
        private readonly databaseservice:DatabaseService
    ){}

    async insertlocation(data:{name:string,type:'country'| 'state'|'county'|'city',parent:string}){
        if(!data){
             throw new BadRequestException('Provide necessary information')
        }

        if(Array.isArray(data)){
            throw new BadRequestException('Cannot process a array')
        }

        const location=  this.databaseservice.getEntityRepository(Location)

        console.log('states data', data)
       

        let parent:Location
        if(data.type==='country'){
             parent= await location.save({
                name:data.name,
                type:data.type,
                parent:undefined
            })
            return parent
        }else {
            parent= await location.findOne({
                where:{name:data.parent}
            }) as Location
        }
        console.log(parent)
        if (!parent) {
            throw new BadRequestException('Parent location not found')
        }


        const insert = await location.save (
            {
                name:data.name,
                type:data.type,
                parent:{
                    id:parent.id
                }

            }
        )

        console.log(insert)
    }

    async bulkInsert(data:[{name:string,type:'country'| 'state'|'county'|'city',parent:string}]){
        if(!data) throw new BadRequestException('Provide necessary information')
             const location= this.databaseservice.getEntityRepository(Location)

        if(!Array.isArray){
            throw new BadRequestException('Only array can be processed')
        }

        // const parentcheck=[]
        // const alter= data.filter((item)=>)
        
            data.forEach(async (item)=>{
                const parentfind = await location.findOne({
                    where:{name:item.parent}
                })
                if(!parentfind) console.log('no parent found')
                const childinsert= await location.save({
                    name:item.name,
                    type:item.type,
                    parent:{
                        id:parentfind?.id
                    }
                })

                console.log(childinsert)
            })

        }

            

}
