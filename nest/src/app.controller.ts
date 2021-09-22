import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDataService } from './user-data/user-data.service';
import { getConfig, isDevProfile } from './util';
import { google } from 'googleapis';
import { Credentials, OAuth2Client } from 'google-auth-library';
const jwt = require('jsonwebtoken');

@Controller('api')
export class AppController {
  constructor(private readonly userDataService: UserDataService) {}

  @Get('auth_url')
  getAuthUrl(): string {
    const config = getConfig();
    const oauth2Client = AppController.oauth2Client();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: config.oauth2Credentials.scope,
    });
  }

  @Get('auth_callback')
  getAuthCallback(@Req() req: Request, @Res() res: Response): void {
    const config = getConfig();
    const redirectUrl = isDevProfile() ? config.angularDevUrl!! : '/';
    const oauth2Client = AppController.oauth2Client();

    if (req.query.error) {
      // The user did not give us permission
      res.redirect(redirectUrl);
    } else {
      oauth2Client.getToken(<string>req.query.code, function (err, token) {
        if (err) return res.redirect(redirectUrl);

        res.cookie('jwt', jwt.sign(token, config.jwtSecret));
        res.redirect(redirectUrl);
      });
    }
  }

  @Get('user_data')
  async getUserData(@Req() req: Request): Promise<any> {
    if (req.cookies.jwt) {
      return this.userDataService.findOne(AppController.getUserId(req));
    }
    return Promise.resolve({});
  }

  @Post('user_data')
  postUserData(@Req() req: Request): void {
    if (req.cookies.jwt) {
      this.userDataService.save(AppController.getUserId(req), req.body);
    }
  }

  private static getUserId(req: Request): string {
    const config = getConfig();

    const oauth2Client = this.oauth2Client();
    oauth2Client.credentials = <Credentials>(
      jwt.verify(req.cookies.jwt, config.jwtSecret)
    );
    return <string>jwt.decode(oauth2Client.credentials.id_token).sub;
  }

  private static oauth2Client(): OAuth2Client {
    const config = getConfig();

    return new google.auth.OAuth2(
      config.oauth2Credentials.clientId,
      config.oauth2Credentials.clientSecret,
      config.oauth2Credentials.redirectUri,
    );
  }
}
