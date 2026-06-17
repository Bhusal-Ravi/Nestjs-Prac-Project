import { Url } from "src/url/url.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, Unique } from "typeorm";

@Entity('locations')
@Unique(["name", "type"])
@Tree("closure-table")
export class Location{

    @PrimaryGeneratedColumn()
    id!:number  

    @Column(
    )
    name!:string

    @Column({
        type:'enum',
        enum:['country','state','county','city'],
    })
    type!:'country'| 'state'|'county'|'city';

    @Column({ type: 'json', nullable: true })
    coordinates!: object | null;

    @OneToMany(()=>Url,(url)=>url.location)
    urls!:Url[]

    @TreeParent()
    parent!:Location;

    @TreeChildren()
    children!: Location[]
    




}