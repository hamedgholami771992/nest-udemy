import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { Request } from "express";
import { TokenPayload } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt"){
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([   //we have to specify where in request object, the JWT is specified
                //we have to change the type from express.Request to any, because it can also be a rpc call
                (request: any) => {
                    console.log(request)
                    return request?.cookies?.Authentication || request.Authentication   //request.Authentication in case of rpc call from other services
                }
            ]),
            secretOrKey: configService.get('JWT_SECRET')              //which is going to be JWT secret value that it will use to decode it
        })
    }


    //after the JWT is decoded, the token payload is going to be supplied to the validate method, which this strategy will take care of it for us
    async validate({ userId }: TokenPayload){
        return this.usersService.getUser({_id: userId})
    }
}