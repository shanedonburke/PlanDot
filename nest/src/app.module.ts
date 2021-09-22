import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { UserData, UserDataSchema } from './user-data/schemas/user-data.schema';
import { UserDataService } from './user-data/user-data.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: 'public',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/plandot'),
    MongooseModule.forFeature([
      { name: UserData.name, schema: UserDataSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [UserDataService],
})
export class AppModule {}
