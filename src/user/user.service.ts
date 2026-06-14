import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import bcrypt from 'bcrypt'
import { Repository } from 'typeorm';
import { User } from './user.entity';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { DatabaseService } from 'src/database/database.service';

dotenv.config()

@Injectable()
export class UserService {
   constructor (
    private readonly databaseService: DatabaseService,
   ){}
   

    async setUser({username,password,region}:{username:string,password:string,region:string}){

    const password_hash = await bcrypt.hash(password,10) 


    const userRepository =
      this.databaseService.getEntityRepository(
        User,
      );



        const createUser= await userRepository.insert( {
                                    username:username,
                                    password:password_hash
       }
        )

        
        if (createUser.identifiers.length===0) throw new InternalServerErrorException('User could not be created')
         return {
    success:true,}



        }

    async loginUser({
    username,
    password,
    region,
  }: {
    username: string;
    password: string;
    region: string;
  }) {
    

    const userRepository =
      this.databaseService.getEntityRepository(
        User,
      );

    const user = await userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new BadRequestException(
        'User not found',
      );
    }

    const match = await bcrypt.compare(
      password,
      user.password,
    );

    if (!match) {
      throw new BadRequestException(
        'Incorrect Username or Password',
      );
    }

    const payload = {
      username,
      userid: user.id,
      region,
    };

    const token = jwt.sign(
      payload,
      process.env.SECRET_KEY!,
      {
        expiresIn: '1h',
      },
    );

    return token;
  }

    


}
