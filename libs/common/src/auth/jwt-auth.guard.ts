import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Observable, map, tap } from "rxjs";
import { AUTH_SERVICE } from "../constants/services";
import { ClientProxy } from "@nestjs/microservices";
import { UserDto } from "../dto";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy  //which is an object allows us to communicate to other microservices via the provided transport layer
    ){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const jwt = context.switchToHttp().getRequest().cookies?.Authentication
        if(!jwt){
            return false
        }
        //to send a rpc req to auth service to validate the jwt token for the user
       return this.authClient.send<UserDto>('authenticate', {   //1th arg=messagePattern, 2th arg=data
            Authentication: jwt
        }).pipe(   //we are going to pipe some operators onto this observable
            tap((res) => {   //allows us to execute a side effect on the incoming response from auth service
                //res is indeed is a user obj
                context.switchToHttp().getRequest().user = res     //because we are returning user obj from "authenticate" msgPattern in auth service
            }),
            map(() => true)  //we return true from canActivate, if we have successful res back from auth service, meaning we are authenticated
        )  
    }
    
}



// The send method of ClientProxy is used to send a message with a pattern 'authenticate' along with the JWT token wrapped inside an object. The send method returns an Observable.
// Processing the Response:
// tap Operator: The tap operator from RxJS is used here for a side effect. The side effect in this case is setting the user property of the request to the user object returned by the authentication service. This allows downstream handlers (e.g., controllers) to access the authenticated user's information directly from the request object.
// map Operator: After setting the user, it maps the result to true, indicating that the JWT is valid and the request is authorized. The map operator transforms the emitted items of the observable, which in this case, ignores the user object and just returns true.