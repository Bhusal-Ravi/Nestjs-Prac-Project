import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import bcrypt from 'bcrypt'
import { Repository } from 'typeorm';
import { User } from './user.entity';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

@Injectable()
export class UserService {
   constructor (
     @Inject('USER_REPOSITORY')
    private readonly userRepository:Repository<User>,

    @Inject('USA_USER_REPOSITORY')
    private readonly usa_userReposiroty:Repository<User>
    

   ){}
   

    
    

    async setUser({username,password,region}:{username:string,password:string,region:string}){
        if(!region) throw new BadRequestException('Provide all required fields')

        const password_hash = await bcrypt.hash(password,10)

        const repository = region==='usa' ? this.usa_userReposiroty : this.userRepository

        const createUser= await repository.insert({
                                    username:username,
                                    password:password_hash
       }
        )

        
        if (createUser.identifiers.length===0) throw new InternalServerErrorException('User could not be created')
         return {
    success:true,}

        }

    async loginUser({username,password,region}:{username:string,password:string,region:string}){
      
        
        if(!region) throw new BadRequestException('Provide all required fields')
        let user:User | null
       if(region==='usa'){
        user= await this.usa_userReposiroty.findOne({
            where:{username}
        })
       }else {
        user= await this.userRepository.findOne({
            where:{username}
        })
       }
        
        if(!user) throw new BadRequestException('User not found')

        const db_Password= user.password

        const match= await bcrypt.compare(password,db_Password)

        if(!match){
            throw new BadRequestException('Incorrect Username or Password')
        }


        const payload= {
        username:username,
        userid:user.id,
        region:region
        }

        const token= jwt.sign(payload,process.env.SECRET_KEY,{
            expiresIn:'1h'
        })

        return token

    }

    


}
