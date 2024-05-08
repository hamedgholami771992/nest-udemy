import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './gaurds/local-auth.gaurd';
import { CurrentUser } from '@app/common';
import { UserDocument } from './users/models/user.schema';
import { Response, response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './gaurds/jwt-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response  //'passthrough' makes sure the response is sent manually
    //we want to access to set the JWT as a cookie instead of passing as plain text, because cookies are much more secure
  ) {
    await this.authService.login(user, response)
    response.send(user)
  }



  @UseGuards(JwtAuthGuard) //to check incoming jwt, verfiy it and return a user that is associated with it, guard still work just the same in microservices
  @MessagePattern("authenticate")  //we have to provide the message pattern
  async authenticate(
    @Payload() data: any       //extracts the payload of this message pattern which is the same request obj which JwtAuthGuard receives
  ) {
    return data.user  //after user key added by guard to the request obj
  }
}
