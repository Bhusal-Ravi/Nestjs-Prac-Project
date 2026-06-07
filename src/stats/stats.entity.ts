import { User } from "src/user/user.entity"
import { Url } from "src/url/url.entity"
import { Entity, PrimaryGeneratedColumn, Column, ForeignKey, ManyToOne, JoinColumn, OneToOne } from "typeorm"

@Entity()
export class Stats {
    @PrimaryGeneratedColumn()
    id!: number

    @OneToOne(()=>Url,(url)=>url.stats)
    @JoinColumn({name:'url_id'})
    url!:Url

    @Column({default:0})
    count!: number
    

    @ManyToOne(()=>User,(user)=>user.stats)
    @JoinColumn({name:'user_id'})
    user!: User


  
}