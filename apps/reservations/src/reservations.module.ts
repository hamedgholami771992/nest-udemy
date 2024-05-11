import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { ReservationDocument, ReservationSchema } from './models/reservation.schema';
import { LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { ClientProvider, ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants/services';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([{ name: ReservationDocument.name, schema: ReservationSchema }]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,   //you will not need to import ConfigModule in other modules once it's been loaded in the root module
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required()
      })
    }),
    // ClientsModule.register({   //to register ClientService and provide injection-token
    //   clients: [
    //     {
    //       name: AUTH_SERVICE, 
    //       transport: Transport.TCP,
    //       options: {
    //         host:  
    //       }
    //     }
    //   ],
    // })
    ClientsModule.registerAsync({   //we are using configService, so we have to use registerAsync version of it
      clients: [{ 
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService): ClientProvider => {
          return {
            transport: Transport.TCP,
            options: {
              host: configService.get("AUTH_HOST"), 
              port: configService.get("AUTH_PORT")
            }
          }
        },
        inject: [ConfigService]
      }]
    })
  ],
  controllers: [ReservationsController, ReservationsModule],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule { }
