
import { DataSource, Repository } from 'typeorm';
import { Url } from './url/url.entity';
import { User } from './user/user.entity';
import { Stats } from './stats/stats.entity';


export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const host = process.env.MYSQL_HOST ?? '127.0.0.1';
      const port = Number(process.env.MYSQL_PORT ?? 3306);
      const username = process.env.MYSQL_USER ?? 'root';
      const password = process.env.MYSQL_PASSWORD ?? 'test';
      const database = process.env.MYSQL_DATABASE ?? 'keen_kapitsa';

      const dataSource = new DataSource({
        type: 'mysql',
        host,
        port,
        username,
        password,
        database,
        entities: [Url, User,Stats],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
  {
    provide: 'URL_REPOSITORY',
    useFactory: (dataSource: DataSource): Repository<Url> =>
      dataSource.getRepository(Url),
    inject: ['DATA_SOURCE'],
  },{
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource): Repository<User> =>
      dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },{
    
    provide: 'STATS_REPOSITORY',
    useFactory: (dataSource: DataSource): Repository<Stats> =>
      dataSource.getRepository(Stats),
    inject: ['DATA_SOURCE'],
  
  }
];
