import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import { connection } from 'mongoose';
import * as process from 'process';
import * as request from 'supertest';
import * as YAML from 'yaml';
import { AppModule } from './../src/app.module';
import {
  UserData,
  UserDataDocument,
} from './../src/user-data/schemas/user-data.schema';

describe('AppController (e2e)', () => {
  const AUTH_URL = 'https://auth.com';
  const ANGULAR_DEV_URL = 'http://localhost:4200';
  const JWT =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  let OLD_NODE_ENV: string;

  let app: INestApplication;
  let moduleFixture: TestingModule;

  let userDataModel: mongoose.Model<UserData>;

  beforeEach(async () => {
    setup1();

    OLD_NODE_ENV = process.env.NODE_ENV;

    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();

    setup2();
  });

  afterEach(async () => {
    process.env.NODE_ENV = OLD_NODE_ENV;
    await mongoose.connection.close();
    await connection.close();
    await app.close();
    await moduleFixture.close();
  });

  it('/api/auth_url (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/auth_url')
      .expect(200)
      .expect(AUTH_URL);
  });

  it('/api/auth_callback (GET, dev profile)', () => {
    process.env.NODE_ENV = 'dev';
    return request(app.getHttpServer())
      .get('/api/auth_callback')
      .expect(302)
      .expect('Location', ANGULAR_DEV_URL)
      .then(() => {
        expect(jwt.sign).toHaveBeenCalled();
      });
  });

  it('/api/auth_callback (GET, prod profile)', () => {
    process.env.NODE_ENV = 'prod';
    return request(app.getHttpServer())
      .get('/api/auth_callback')
      .expect(302)
      .expect('Location', '/')
      .then(() => {
        expect(jwt.sign).toHaveBeenCalled();
      });
  });

  it('/api/user_data (GET, has auth)', () => {
    return request(app.getHttpServer())
      .get('/api/user_data')
      .set('Cookie', `jwt=${JWT}`)
      .expect(200)
      .expect({
        groups: [],
        items: [],
      });
  });

  it('/api/user_data (GET, no auth)', () => {
    return request(app.getHttpServer())
      .get('/api/user_data')
      .expect(200)
      .expect({});
  });

  it('/api/user_data (GET, no user data)', () => {
    (userDataModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    } as unknown as mongoose.Query<any, any>);
    return request(app.getHttpServer())
      .get('/api/user_data')
      .set('Cookie', `jwt=${JWT}`)
      .expect(200)
      .expect({});
  });

  it('/api/user_data (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/user_data')
      .set('Cookie', `jwt=${JWT}`)
      .send({
        groups: [],
        items: [],
      })
      .expect(201)
      .then(() => {
        expect(userDataModel.findOneAndUpdate).toHaveBeenCalled();
      });
  });

  function setup1(): void {
    jest.spyOn(YAML, 'parse').mockReturnValue({
      jwtSecret: 'jwtSecret',
      angularDevUrl: ANGULAR_DEV_URL,
      port: 8080,
      oauth2Credentials: {
        projectId: 'projectId',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        redirectUri: 'http://localhost:8080/api/auth_callback',
        authUri: 'https://accounts.google.com/o/oauth2/auth',
        tokenUri: 'https://oauth2.googleapis.com/token',
        authProviderX509CertUrl: 'https://www.googleapis.com/oauth2/v1/certs',
        scope: ['https://www.googleapis.com/auth/userinfo.email'],
      },
    });
    jest.spyOn(google.auth, 'OAuth2').mockImplementation(() => {
      return {
        generateAuthUrl: jest.fn().mockReturnValue(AUTH_URL),
        getToken: jest.fn().mockImplementation((_, callback) => {
          callback(null, { access_token: 'access_token' });
        }),
      } as unknown as OAuth2Client;
    });
    jest.spyOn(jwt, 'sign').mockReturnValue(JWT);
    jest.spyOn(jwt, 'verify').mockReturnValue({});
    jest.spyOn(jwt, 'decode').mockReturnValue({ sub: 'someid' });
  }

  function setup2(): void {
    userDataModel = moduleFixture.get<mongoose.Model<UserData>>(
      getModelToken(UserData.name),
    );

    jest.spyOn(userDataModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        groups: [],
        items: [],
      } as UserDataDocument),
    } as unknown as mongoose.Query<any, any>);
    jest.spyOn(userDataModel, 'findOneAndUpdate');
  }
});
