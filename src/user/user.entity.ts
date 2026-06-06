import { Url } from "src/url/url.entity"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({unique:true,nullable:false}) 
    username!: string

    @Column({nullable:false})
    password!: string

    @OneToMany(()=>Url,(url)=>url.user)
    urls!:Url[];

  
}   