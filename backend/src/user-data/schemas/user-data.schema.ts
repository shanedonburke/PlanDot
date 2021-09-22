import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type UserDataDocument = Document & UserData;

@Schema({ collection: 'userData' })
export class UserData implements UserDataDto {
  @Prop({ type: mongoose.Schema.Types.String })
  _id: string;

  @Prop({ required: true })
  items: Array<Item>;

  @Prop({ required: true })
  groups: Array<Group>;
}

export const UserDataSchema = SchemaFactory.createForClass(UserData);

export interface UserDataDto {
  items: Array<Item>;
  groups: Array<Group>;
}

interface Group {
  id: string;
  name: string;
  color: string;
  itemIds: Array<string>;
}

interface Item {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  isDateEnabled: boolean;
  repeat: string;
  weekdays: Array<number>;
  startTime: ItemTime;
  endTime: ItemTime;
  isStartTimeEnabled: boolean;
  isEndTimeEnabled: boolean;
  groupIds: Array<string>;
  isFavorited: boolean;
}

interface ItemTime {
  hours: number;
  minutes: number;
  period: 'AM' | 'PM';
}
