import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Stats } from './stats.entity';

@Injectable()
export class StatsService {
  constructor(
    @Inject('STATS_REPOSITORY')
    private readonly statsRepository: Repository<Stats>,

    @Inject('USA_STATS_REPOSITORY')
    private readonly usaStatsRepository: Repository<Stats>,
  ) {}

  private getStatsRepository(region?: string) {
    return region === 'usa' ? this.usaStatsRepository : this.statsRepository;
  }

  async getStats(user_id: number, url_id: number, region?: string): Promise<Stats | null> {
    // console.log(user_id,url_id)
    const repository = this.getStatsRepository(region)

    const stats = await repository.findOne({
      where: {
        user: { id: user_id },
        url: { id: url_id },
      },
    });

    console.log(stats);

    return stats;
  }

  async updateStats(user_id: number, url_id: number, region?: string) {
    const repository = this.getStatsRepository(region)

    const updateStats = await repository
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

  async setStats(user_id: number, url_id: number, region?: string) {
    const repository = this.getStatsRepository(region)

    const setStats = await repository
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
