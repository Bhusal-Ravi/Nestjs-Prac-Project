
import { DataSource, Repository } from 'typeorm';
import { Url } from './url/url.entity';
import { User } from './user/user.entity';
import { Stats } from './stats/stats.entity';


const euDataSource = new DataSource({
  type: 'mysql',
  host: process.env.EU_MYSQL_HOST ?? '127.0.0.1',
  port: Number(process.env.EU_MYSQL_PORT ?? 3306),
  username: process.env.EU_MYSQL_USER ?? 'root',
  password: process.env.EU_MYSQL_PASSWORD ?? 'test',
  database: process.env.EU_MYSQL_DATABASE ?? 'keen_kapitsa',
  entities: [Url, User, Stats],
  synchronize: true,
   
});


const usaDataSource = new DataSource({
  type: 'mysql',
  host: process.env.USA_MYSQL_HOST ?? '127.0.0.1',
  port: Number(process.env.USA_MYSQL_PORT ?? 3307),   
  username: process.env.USA_MYSQL_USER ?? 'root',
  password: process.env.USA_MYSQL_PASSWORD ?? 'testusa',
  database: process.env.USA_MYSQL_DATABASE ?? 'usa_db',
  entities: [Url, User, Stats],
  synchronize: true,
  
});

export const databaseProviders = [
    {
    provide: 'DATA_SOURCE',
    useFactory: async () => euDataSource.initialize(),
  },
  {
    provide: 'URL_REPOSITORY',
    useFactory: (ds: DataSource) => ds.getRepository(Url),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'USER_REPOSITORY',
    useFactory: (ds: DataSource) => ds.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'STATS_REPOSITORY',
    useFactory: (ds: DataSource) => ds.getRepository(Stats),
    inject: ['DATA_SOURCE'],
  },

  
  {
    provide: 'USA_DATA_SOURCE',
    useFactory: async () => usaDataSource.initialize(),
  },
  {
    provide: 'USA_URL_REPOSITORY',
    useFactory: (ds: DataSource) => ds.getRepository(Url),
    inject: ['USA_DATA_SOURCE'],
  },
  {
    provide: 'USA_USER_REPOSITORY',
    useFactory: (ds: DataSource) => ds.getRepository(User),
    inject: ['USA_DATA_SOURCE'],
  },
  {
    provide: 'USA_STATS_REPOSITORY',
    useFactory: (ds: DataSource) => ds.getRepository(Stats),
    inject: ['USA_DATA_SOURCE'],
  },
];


