import { Module } from '@nestjs/common';
import {
  AddressRepositoryToken,
  EntityIdGeneratorServiceToken,
  GeocodingServiceToken,
} from './tokens';
import { UuidV4EntityIdGeneratorService } from './infrastructure/service/uuid-v4-entity-id-generator.service';
import { TypeOrmAddressRepository } from './infrastructure/repository/typeorm-address.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  APP_CONFIG_PROPS,
  AppConfigVariables,
  Environment,
} from './infrastructure/config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmAddressModel } from './infrastructure/model/typeorm-address.model';
import {
  DATABASE_CONFIG_PROPS,
  DatabaseConfigVariables,
} from './infrastructure/config/database.config';
import { FakeGeocodingService } from './infrastructure/service/fake-geocoding.service';
import { ConvertAddressToCoordinatesController } from './interface/controller/convert-address-to-coordinates.controller';
import { ConvertAddressToCoordinatesUseCase } from './application/use-case/convert-address-to-coordinates.use-case';
import { AddressFactory } from './domain/factory/address.factory';

const typeOrmEntities = [TypeOrmAddressModel];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [APP_CONFIG_PROPS, DATABASE_CONFIG_PROPS],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [APP_CONFIG_PROPS.KEY, DATABASE_CONFIG_PROPS.KEY],
      useFactory: (
        appConfig: AppConfigVariables,
        dbConfig: DatabaseConfigVariables,
      ): DataSourceOptions => {
        if (appConfig.NODE_ENV === Environment.LOCAL) {
          return {
            type: 'sqlite',
            database: ':memory:',
            entities: typeOrmEntities,
            synchronize: true,
            logging: true,
          };
        }

        return {
          type: 'mysql',
          host: dbConfig.DATABASE_HOST,
          port: dbConfig.DATABASE_PORT,
          username: dbConfig.DATABASE_USERNAME,
          password: dbConfig.DATABASE_PASSWORD,
          database: dbConfig.DATABASE_NAME,
          entities: typeOrmEntities,
          synchronize: false,
          logging: false,
        };
      },
    }),
    TypeOrmModule.forFeature(typeOrmEntities),
  ],
  controllers: [ConvertAddressToCoordinatesController],
  providers: [
    ConvertAddressToCoordinatesUseCase,
    AddressFactory,
    {
      provide: EntityIdGeneratorServiceToken,
      useClass: UuidV4EntityIdGeneratorService,
    },
    {
      provide: AddressRepositoryToken,
      useClass: TypeOrmAddressRepository,
    },
    {
      provide: GeocodingServiceToken,
      inject: [APP_CONFIG_PROPS.KEY],
      useFactory: (appConfig: AppConfigVariables) => {
        if (appConfig.NODE_ENV === Environment.LOCAL) {
          return new FakeGeocodingService();
        }

        throw new Error('Not implemented');
      },
    },
  ],
})
export class AppModule {}
