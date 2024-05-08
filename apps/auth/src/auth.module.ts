import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from '@app/common';
import { LoggerModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    UsersModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        HTTP_PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
      })
    }),
    JwtModule.registerAsync({
      //imports: [ConfigModule],     //because we have not used our custom ConfigModule, we dont need to import it  
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: {
            expiresIn: `${configService.get("JWT_EXPIRATION")}s`
          }
        }
      },
      inject: [ConfigService]
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtModule],
})
export class AuthModule {}
