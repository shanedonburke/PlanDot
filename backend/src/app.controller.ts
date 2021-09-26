import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import * as jwt from 'jsonwebtoken';
import { UserDataService } from './user-data/user-data.service';
import { getConfig, isDevProfile } from './util';

/**
 * Controller for all API endpoints.
 */
@Controller('api')
export class AppController {
  constructor(private readonly userDataService: UserDataService) {}

  /**
   * Get the authentication URL for Google OAuth2, to which the user will be
   * redirected by the frontend when they attempt to login.
   * @returns The authentication URL.
   */
  @Get('auth_url')
  getAuthUrl(): string {
    const config = getConfig();
    const oauth2Client = AppController.oauth2Client();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: config.oauth2Credentials.scope,
    });
  }

  /**
   * The endpoint given to Google OAuth2 as the redirect URL for when the user
   * has authenticated. Redirects the user to the home page with their new
   * JWT cookie.
   * @param req The request object.
   * @param res The response object.
   */
  @Get('auth_callback')
  getAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): void {
    const config = getConfig();
    const redirectUrl = isDevProfile() ? config.angularDevUrl!! : '/';
    const oauth2Client = AppController.oauth2Client();

    if (req.query.error) {
      // The user did not give us permission
      res.redirect(redirectUrl);
    } else {
      oauth2Client.getToken(<string>req.query.code, function (err, token) {
        if (err) {
          res.redirect(redirectUrl);
        } else {
          res.cookie('jwt', jwt.sign(token, config.jwtSecret));
          res.redirect(redirectUrl);
        }
      });
    }
  }

  /**
   * Retrieves user data (groups and items) for the user based on their
   * JWT cookie.
   * @param req Request object with a JWT cookie.
   * @returns Object containing user data. If the user is not logged in or
   *   there is no data for the user, returns an empty object.
   */
  @Get('user_data')
  async getUserData(@Req() req: Request): Promise<any> {
    if (req.cookies.jwt) {
      return (
        (await this.userDataService.findOne(AppController.getUserId(req))) ?? {}
      );
    }
    return {};
  }

  /**
   * Saves user data (groups and items) for the user based on their JWT cookie.
   * @param req Request with user data and a JWT cookie.
   */
  @Post('user_data')
  postUserData(@Req() req: Request): void {
    if (req.cookies.jwt) {
      this.userDataService.save(AppController.getUserId(req), req.body);
    }
  }

  /**
   * Get the user ID from the JWT cookie.
   * @param req Request object with a JWT cookie.
   * @returns The user ID.
   */
  private static getUserId(req: Request): string {
    const config = getConfig();

    const oauth2Client = this.oauth2Client();
    oauth2Client.credentials = <Credentials>(
      jwt.verify(req.cookies.jwt, config.jwtSecret)
    );
    return <string>jwt.decode(oauth2Client.credentials.id_token).sub;
  }

  /**
   * Create a new OAuth2 client based on the configured credentials.
   * @returns The OAuth2 client.
   */
  private static oauth2Client(): OAuth2Client {
    const config = getConfig();

    return new google.auth.OAuth2(
      config.oauth2Credentials.clientId,
      config.oauth2Credentials.clientSecret,
      config.oauth2Credentials.redirectUri,
    );
  }
}
