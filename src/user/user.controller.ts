import { BadRequestException, Body, Controller, MisdirectedException, Post, Put, Req, Res, Session } from '@nestjs/common';
import { UserMiddleware } from './user.middleware';
import { UserService } from './user.service';
import type { Response } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService ){

    }
    @Post('/createuser')
    async createUser(@Body() body:{username:string,password:string,region:string},@Res() res:Response){
        if(!body.username || !body.password || !body.region){
            throw new BadRequestException ("Provide necessary information required")
        }

        const result= await this.userService.setUser({username:body.username,password:body.password,region:body.region})
    
        return res.json({success:true,message:"User created"})
        
        
    }

    @Put('/login')
    async loginUser(@Body() body:{username:string,password:string,region:"string"}, @Res() res:Response){
        if(!body.username || !body.password){
            throw new BadRequestException ("Provide necessary information required")
        }

        const sessionToken= await this.userService.loginUser({username:body.username,password:body.password,region:body.region})

         res.cookie('sessionToken', sessionToken, {
    httpOnly: true,
    })

    return res.json({
            success:true,
            message:"Logged in successfully"
    })
}
       

}
