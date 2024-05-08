import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';




//each forRootAsync is like defining new anonymous module inside module, and it has imports array as well
@Module({
    imports: [
        MongooseModule.forRootAsync({
            //imports: [ConfigModule],         //we dont use ConfigModule anymore, because we load env variables globally from the parent module
            useFactory: (configService: ConfigService) => {
                return {
                    uri: configService.get("MONGODB_URI")
                }
            },
            inject: [ConfigService]
        }),

    ],
})
export class DatabaseModule {
    static forFeature(models: ModelDefinition[]){
        return MongooseModule.forFeature(models)
    }
 }
