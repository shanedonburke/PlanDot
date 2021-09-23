import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

/** A document in the `userData` collection. */
export type UserDataDocument = Document & UserData;

/**
 * Represents the schema for a user's data.
 */
@Schema({ collection: 'userData' })
export class UserData implements UserDataDto {
  @Prop({ type: mongoose.Schema.Types.String })
  _id: string;

  @Prop({ required: true })
  items: Array<Item>;

  @Prop({ required: true })
  groups: Array<Group>;
}

/** The generated schema for user data. */
export const UserDataSchema = SchemaFactory.createForClass(UserData);

/**
 * Represents a user's data as received from the frontend.
 */
export interface UserDataDto {
  items: Array<Item>;
  groups: Array<Group>;
}

/**
 * Represents a group of items.
 */
interface Group {
  id: string;
  name: string;
  color: string;
  itemIds: Array<string>;
}

/**
 * Represents a single item.
 */
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

/**
 * Represents the start or end time of an item.
 */
interface ItemTime {
  hours: number;
  minutes: number;
  period: 'AM' | 'PM';
}
