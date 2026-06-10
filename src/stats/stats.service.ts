import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Stats } from './stats.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class StatsService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  

  async getStats(user_id: number, url_id: number, region?: string): Promise<Stats | null> {
    // console.log(user_id,url_id)
    if(!region) throw new BadRequestException('Provide all required fields')

     const statsRepository =
          this.databaseService.getEntityRepository(
            
            Stats,
          );

    const stats = await statsRepository.findOne({
      where: {
        user: { id: user_id },
        url: { id: url_id },
      },
    });

    console.log(stats);

    return stats;
  }

  async updateStats(user_id: number, url_id: number, ) {
  

    const statsRepository =
          this.databaseService.getEntityRepository(
            
            Stats,
          );

    const updateStats = await statsRepository
      .createQueryBuilder()
      .update(Stats)
      .set({ count: () => 'count + 1' })
      .where('user_id = :user_id AND url_id = :url_id', {
        user_id,
        url_id,
      })
      .execute();

    console.log(updateStats);
  }

  async setStats(user_id: number, url_id: number) {
    
   

    const statsRepository =
          this.databaseService.getEntityRepository(
            
            Stats,
          );

    const setStats = await statsRepository
      .createQueryBuilder()
      .insert()
      .into(Stats)
      .values([
        {
          user: {
            id: user_id,
          },

          url: {
            id: url_id,
          },
          count: 0,
        },
      ])
      .execute();

    console.log(setStats);
  }
}
