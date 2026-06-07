import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Stats } from './stats.entity';

@Injectable()
export class StatsService {
  constructor(
    @Inject('STATS_REPOSITORY')
    private readonly statsRepository: Repository<Stats>,
  ) {}

  async getStats(user_id: number, url_id: number): Promise<Stats | null> {
    // console.log(user_id,url_id)
    const stats = await this.statsRepository.findOne({
      where: {
        user: { id: user_id },
        url: { id: url_id },
      },
    });

    console.log(stats);

    return stats;
  }

  async updateStats(user_id: number, url_id: number) {
    const updateStats = await this.statsRepository
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
    const setStats = await this.statsRepository
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
