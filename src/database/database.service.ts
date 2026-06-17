import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { EntityTarget, Repository, ObjectLiteral } from "typeorm";
import { DataSource } from "typeorm/browser";

@Injectable({scope:Scope.REQUEST})
export class DatabaseService {
  constructor(  
    @Inject('DATA_SOURCE_MAP')
    private readonly dataSourceMap: Map<string, DataSource>,
    
    @Inject(REQUEST)
    private readonly request: any,


  ) {}
  
  getEntityRepository<T extends ObjectLiteral>(
    
    entity: EntityTarget<T>,
  ): Repository<T> {
    const region= this.request.region ||'usa'
    if (!region) throw new BadRequestException('Region not found in request');
    const ds = this.dataSourceMap.get(region);

    if (!ds) {
      throw new Error(`Region ${region} not found`);
    }
    return ds.getRepository(entity);
  }
          
    async insertlocaton(location:{}){
          
    }

    



}