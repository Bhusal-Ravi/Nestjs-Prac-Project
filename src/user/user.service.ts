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
    private readonly userRepository:Repository<User>
   ){}
   

    private username:string=""
    private password:string=""
    
    

    async setUser({username,password}:{username:string,password:string}){
        this.username=username
        this.password=password

        const password_hash = await bcrypt.hash(this.password,10)
        this.password = password_hash
        const createUser= await this.userRepository.insert({
                                    username:this.username,
                                    password:this.password
        }
        )

        
        if (createUser.identifiers.length===0) throw new InternalServerErrorException('User could not be created')
         return {
    success:true,}

        }

    async loginUser({username,password}:{username:string,password:string}){
        this.username=username
        this.password=password
        


        const user= await this.userRepository.find({
            where:{username}
        })

        const db_Password= user[0].password

        const match= await bcrypt.compare(this.password,db_Password)

        if(!match){
            throw new BadRequestException('Incorrect Username or Password')
        }


        const payload= {
        username:username,
        userid:user[0].id
        }

        const token= jwt.sign(payload,process.env.SECRET_KEY,{
            expiresIn:'1h'
        })

        return token

    }

    


}
