import { AuthGuard } from '@nestjs/passport'



export class LocalAuthGuard extends AuthGuard('local'){  //we pass the name of strategy we are using

}