import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser'
import { Transport } from '@nestjs/microservices';


//this is a hybrid application, listens for both incomming http connections in our controllers as well as over microservice layer
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);  //it awaits for creating the app structure and IOC container
  const configService = app.get(ConfigService)  //after the app structure is built, then we can get services directly
  app.connectMicroservice({   //listens for incomming tcp connections from other services
    transport: Transport.TCP, 
    options: {
      host: '0.0.0.0',   //which tells to bind all network interfaces on the host
      port: configService.get("TCP_PORT")
    }
  })  
  app.use(cookieParser())  //as a general middleware to parse cookies
  app.useGlobalPipes(new ValidationPipe({whitelist: true}))
  app.useLogger(app.get(Logger))
 
  await app.startAllMicroservices()   //start all microservices's transport layers
  await app.listen(configService.get("HTTP_PORT"));
}
bootstrap();
