import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local"
import { UsersService } from "../users/users.service";



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {  //we can set a name for the strategy we are using, default is 'local'
    constructor(private readonly usersService: UsersService){
        super({
            usernameField: 'email'    //specifies a field to check the username on, because the users passing us their email to login
        })
    }


    //we have ti implement validate method which is going to get called by our extended passport
    async validate(email: string, password: string){  //what ever is returned by this method, gets automatically added to the request object as the user property
        try {
            return await this.usersService.verifyUser(email, password)
        }
        catch(err){
            return new UnauthorizedException(err)
        }
    }
}

