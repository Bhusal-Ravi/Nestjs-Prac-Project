import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Location } from './location.entity';
import { QueryBuilder } from 'typeorm';
import { Url } from 'src/url/url.entity';
import { get } from 'http';
import * as fs from 'fs';
import * as path from 'path';

type LocationPayload = {
  location_type: string;
  data: {
    originalUrl: string;
    shortUrl: string;
    count: number;
  }[];
};

interface GeoJsonFeature {
  type: string;
  id: string;
  properties: { name: string; density: number };
  geometry: object;
}

interface GeoJsonCollection {
  type: string;
  features: GeoJsonFeature[];
}

interface NyCountyGeoJsonFeature {
  type: string;
  id: string;
  properties: { NAME: string; STATE: string; COUNTY: string };
  geometry: object;
}

interface NyCountyGeoJsonCollection {
  type: string;
  features: NyCountyGeoJsonFeature[];
}


interface NyCountyResponseFeature {
  type: string;
  id: string;
  properties: { name: string; type: string };
  geometry: object;
}


interface NyCountyResponseCollection {
  type: string;
  features: NyCountyResponseFeature[];
}



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

    async getlocation(){
        const location=  this.databaseservice.getEntityRepository(Location)

        const get= await location.
                         createQueryBuilder('l')
                         .select([
                           'u.originalUrl',
                           'u.shortUrl',
                           's.count',
                           'l.name AS location_name',
                           'l.type AS location_type' 
                         ])
                         .innerJoin(
                            'locations_closure',
                            'lc',
                            'lc.id_ancestor=l.id'
                         )
                         .innerJoin(
                            'url',
                            'u',
                            'u.locationId=lc.id_descendant '
                         )
                         
                         .innerJoin(
                            'stats',
                            's',
                            's.url_id=u.id'
                         )
                         .where('l.type=:type',{type:'state'})
                         .orderBy('l.type','ASC')
                         .getRawMany()
                        
                 
                         
        
        const payload:Record<string,LocationPayload>={}

        
        get.map((item,index)=>{
            if(Object.hasOwn(payload,item.location_name)){
                payload[item.location_name].data.push({
                    originalUrl:item.u_originalUrl,
                    shortUrl:item.u_shortUrl,
                    count:item.s_count
                })
            }else{
                   payload[item.location_name]={
                    location_type:item.location_type,
                    data:[{
                    originalUrl:item.u_originalUrl,
                    shortUrl:item.u_shortUrl,
                    count:item.s_count
                   }]
                }
                }
        })

        
        return payload
       
    }

    private buildUrlPayload(
        rows: {
            location_name: string;
            location_type: string;
            u_originalUrl: string;
            u_shortUrl: string;
            s_count: number;
        }[],
    ): Record<string, LocationPayload> {
        const payload: Record<string, LocationPayload> = {};

        rows.forEach((item) => {
            if (Object.hasOwn(payload, item.location_name)) {
                payload[item.location_name].data.push({
                    originalUrl: item.u_originalUrl,
                    shortUrl: item.u_shortUrl,
                    count: item.s_count,
                });
            } else {
                payload[item.location_name] = {
                    location_type: item.location_type,
                    data: [
                        {
                            originalUrl: item.u_originalUrl,
                            shortUrl: item.u_shortUrl,
                            count: item.s_count,
                        },
                    ],
                };
            }
        });

        return payload;
    }

    async getNyCountyUrls(): Promise<Record<string, LocationPayload>> {
        const locationRepo = this.databaseservice.getEntityRepository(Location);

        const nyState = await locationRepo.findOne({
            where: { name: 'New York', type: 'state' },
        });

        if (!nyState) {
            return {};
        }

        const rows = await locationRepo
            .createQueryBuilder('l')
            .select([
                'u.originalUrl',
                'u.shortUrl',
                's.count',
                'l.name AS location_name',
                'l.type AS location_type',
            ])
            .innerJoin('locations_closure', 'lc', 'lc.id_ancestor=l.id')
            .innerJoin('url', 'u', 'u.locationId=lc.id_descendant')
            .innerJoin('stats', 's', 's.url_id=u.id')
            .where('l.type = :type', { type: 'county' })
            .andWhere(
                `EXISTS (
                    SELECT 1 FROM locations_closure lc_ny
                    WHERE lc_ny.id_descendant = l.id AND lc_ny.id_ancestor = :nyId
                )`,
                { nyId: nyState.id },
            )
            .orderBy('l.name', 'ASC')
            .getRawMany();

        return this.buildUrlPayload(rows);
    }

    async getNyCountiesGeoJson(): Promise<NyCountyResponseCollection>  {
    const locationRepo = this.databaseservice.getEntityRepository(Location);

    const nyState = await locationRepo.findOne({
        where: { name: 'New York', type: 'state' },
    });

    if (!nyState) {
        throw new BadRequestException('New York state not found');
    }

    const counties = await locationRepo.find({
        where: { type: 'county', parent: { id: nyState.id } },
    });

    const features = counties
        .filter((c) => c.coordinates !== null)
        .map((c) => {
            const coords = c.coordinates as { id: string; geometry: object };
            return {
                type: 'Feature',
                id: coords.id,
                properties: {
                    name: c.name,
                    type: c.type,
                },
                geometry: coords.geometry,
            };
        });

    return {
        type: 'FeatureCollection',
        features,
    };
}

    async seedNyCounties(): Promise<{ seeded: number; skipped: number }> {
        const seedPath = path.join(__dirname, 'seed-ny-counties.json');
        const raw = fs.readFileSync(seedPath, 'utf-8');
        const geoJson: NyCountyGeoJsonCollection = JSON.parse(raw);

        const locationRepo = this.databaseservice.getEntityRepository(Location);
        let seeded = 0;
        let skipped = 0;

        const nyState = await locationRepo.findOne({
            where: { name: 'New York', type: 'state' },
        });

        if (!nyState) {
            throw new BadRequestException('New York state not found — seed states first');
        }

        for (const feature of geoJson.features) {
            const countyName = feature.properties.NAME;

            const existing = await locationRepo.findOne({
                where: { name: countyName, type: 'county' },
            });

            if (existing) {
                existing.coordinates = {
                    id: feature.id,
                    geometry: feature.geometry,
                };
                await locationRepo.save(existing);
                seeded++;
                continue;
            }

            await locationRepo.save({
                name: countyName,
                type: 'county' as const,
                coordinates: {
                    id: feature.id,
                    geometry: feature.geometry,
                },
                parent: { id: nyState.id },
            });
            seeded++;
        }

        return { seeded, skipped };
    }

    async seedCoordinates(): Promise<{ seeded: number; skipped: number }> {
        const seedPath = path.join(__dirname, 'seed-coordinates.json');
        const raw = fs.readFileSync(seedPath, 'utf-8');
        const geoJson: GeoJsonCollection = JSON.parse(raw);

        const locationRepo = this.databaseservice.getEntityRepository(Location);
        let seeded = 0;
        let skipped = 0;

        for (const feature of geoJson.features) {
            const stateName = feature.properties.name;

            // Try to find existing location by name and type 'state'
            let location = await locationRepo.findOne({
                where: { name: stateName, type: 'state' },
            });

            if (location) {
                // Update existing location with coordinates
                location.coordinates = {
                    id: feature.id,
                    geometry: feature.geometry,
                    density: feature.properties.density,
                };
                await locationRepo.save(location);
                seeded++;
            } else {
                // Create new location record with coordinates
                // Find the 'country' parent (USA) if it exists
                let parent = await locationRepo.findOne({
                    where: { type: 'country' },
                });

                await locationRepo.save({
                    name: stateName,
                    type: 'state' as const,
                    coordinates: {
                        id: feature.id,
                        geometry: feature.geometry,
                        density: feature.properties.density,
                    },
                    parent: parent ? { id: parent.id } : undefined,
                });
                seeded++;
            }
        }

        return { seeded, skipped };
    }

    async getGeoJson(): Promise<GeoJsonCollection> {
        const locationRepo = this.databaseservice.getEntityRepository(Location);

        const states = await locationRepo.find({
            where: { type: 'state' },
        });

        const features: GeoJsonFeature[] = states
            .filter((s) => s.coordinates !== null)
            .map((s) => {
                const coords = s.coordinates as {
                    id: string;
                    geometry: object;
                    density: number;
                };
                return {
                    type: 'Feature',
                    id: coords.id,
                    properties: {
                        name: s.name,
                        density: coords.density,
                    },
                    geometry: coords.geometry,
                };
            });

        return {
            type: 'FeatureCollection',
            features,
        };
    }
            
    
}



// select u.originalUrl,u.shortUrl,s.count,l.name as location_name,l.type as location_type
//                          from url u join locations_closure lc on lc.id_descendant=u.locationId
//                          join locations l on l.id=lc.id_ancestor join stats s on s.url_id=u.id
//                          where l.type='state'   order by l.type ;