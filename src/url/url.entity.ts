import { Location } from "src/location/location.entity"
import { Stats } from "src/stats/stats.entity"
import { User } from "src/user/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, ForeignKey, ManyToOne, JoinColumn, OneToOne } from "typeorm"

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    originalUrl!: string

    @Column()
    shortUrl!: string

    @ManyToOne(()=>Location,(location)=>location.urls)
    location!:Location

    @OneToOne(()=>Stats,(stats)=>stats.url)
    stats!:Stats

    @ManyToOne(()=>User,(user)=>user.urls)
    @JoinColumn({name:'user_id'})
    user!: User


  
}