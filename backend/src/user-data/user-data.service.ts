import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserData, UserDataDto } from './schemas/user-data.schema';

/**
 * A service to interact with the user data collection.
 */
@Injectable()
export class UserDataService {
  constructor(
    @InjectModel(UserData.name) private readonly userDataModel: Model<UserData>,
  ) {}

  /**
   * Saves the given user data under the user's ID.
   * @param userId The user's ID, derived from their JWT.
   * @param userDataDto The user data to save.
   */
  async save(userId: string, userDataDto: UserDataDto): Promise<UserData> {
    const userData = new this.userDataModel(userDataDto);
    userData._id = userId;
    return this.userDataModel.findOneAndUpdate({ _id: userId }, userData, {
      upsert: true,
      projection: { _id: false },
    }).exec();
  }

  /**
   * Retrieves the user data for the given user ID.
   * @param userId The user's ID, derived from their JWT.
   * @returns A promise that resolves to the user's data or null
   *   if no data is found.
   */
  async findOne(userId: string): Promise<Omit<UserData, '_id'> | null> {
    return this.userDataModel.findOne({ _id: userId }, { _id: false }).exec();
  }
}
