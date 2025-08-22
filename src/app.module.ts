import { Module } from '@nestjs/common';
import {
  AddressRepositoryToken,
  EntityIdGeneratorServiceToken,
  GeocodingServiceToken,
} from './tokens';
import { UuidV4EntityIdGeneratorService } from './infrastructure/service/uuid-v4-entity-id-generator.service';
import { TypeOrmAddressRepository } from './infrastructure/repository/typeorm-address.repository';
import { ConfigModule } from '@nestjs/config';
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
import { HttpModule, HttpService } from '@nestjs/axios';
import { GoogleAPIGeocodingService } from './infrastructure/service/google-api-geocoding.service';
import * as path from 'path';

const typeOrmEntities = [TypeOrmAddressModel];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [APP_CONFIG_PROPS, DATABASE_CONFIG_PROPS],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [DATABASE_CONFIG_PROPS.KEY],
      useFactory: (dbConfig: DatabaseConfigVariables): DataSourceOptions => {
        if (dbConfig.DATABASE_DRIVER === 'sqlite') {
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
          migrations: [
            path.join(__dirname, 'infrastructure', 'migrations', '*.{ts,js}'),
          ],
          migrationsRun: true,
          synchronize: false,
          logging: false,
        };
      },
    }),
    TypeOrmModule.forFeature(typeOrmEntities),
    HttpModule.register({
      timeout: 15000,
    }),
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
      inject: [APP_CONFIG_PROPS.KEY, HttpService],
      useFactory: (appConfig: AppConfigVariables, httpService: HttpService) => {
        if (appConfig.NODE_ENV === Environment.LOCAL) {
          return new FakeGeocodingService();
        }

        if (!appConfig.GOOGLE_API_GEOCODING_KEY) {
          throw new Error('Google API Geocoding key is not defined.');
        }

        return new GoogleAPIGeocodingService(
          httpService,
          appConfig.GOOGLE_API_GEOCODING_KEY,
        );
      },
    },
  ],
})
export class AppModule {}
