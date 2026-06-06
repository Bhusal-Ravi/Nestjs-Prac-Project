import { User } from "src/user/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, ForeignKey, ManyToOne, JoinColumn } from "typeorm"

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    originalUrl!: string

    @Column()
    shortUrl!: string

    @ManyToOne(()=>User,(user)=>user.urls)
    @JoinColumn({name:'user_id'})
    user!: User


  
}