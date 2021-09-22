import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserData, UserDataDto } from './schemas/user-data.schema';

@Injectable()
export class UserDataService {
  constructor(
    @InjectModel(UserData.name) private readonly userDataModel: Model<UserData>,
  ) {}

  save(userId: string, userDataDto: UserDataDto): void {
    const userData = new this.userDataModel(userDataDto);
    userData._id = userId;
    this.userDataModel.findOneAndUpdate({ _id: userId }, userData, {
      upsert: true,
    });
  }

  async findOne(userId: string): Promise<UserData> {
    return this.userDataModel.findOne({ _id: userId });
  }
}
