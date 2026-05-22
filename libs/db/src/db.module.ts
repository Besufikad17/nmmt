import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

export interface DbConnectionOptions {
  name: string;
  uri: string;
  synchronize?: boolean;
  logging?: boolean;
}

@Global()
@Module({})
export class DbModule {
  static forRoot(options: DbConnectionOptions): DynamicModule {
    return {
      module: DbModule,
      imports: [
        TypeOrmModule.forRootAsync({
          name: options.name,
          imports: [ConfigModule],
          useFactory: () => ({
            type: 'postgres',
            url: options.uri,
            autoLoadEntities: true,
            synchronize: options.synchronize,
            logging: options.logging,
          }),
        }),
      ],
      exports: [TypeOrmModule],
    };
  }

  static forFeatureTypeORM(entities: any[], datasourceName: string) {
    return TypeOrmModule.forFeature(entities, datasourceName);
  }
}
