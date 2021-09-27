import mongoose from 'mongoose';

/**
 * Represents the start or end time of an item.
 */
const ItemTime = {
  hours: Number,
  minutes: Number,
  period: String,
};

const userDataSchema = new mongoose.Schema({
  _id: String,
  items: [
    {
      id: String,
      title: String,
      description: String,
      location: String,
      date: String,
      isDateEnabled: Boolean,
      repeat: String,
      weekdays: [Number],
      startTime: ItemTime,
      endTime: ItemTime,
      isStartTimeEnabled: Boolean,
      isEndTimeEnabled: Boolean,
      groupIds: [String],
      isFavorited: Boolean,
    },
  ],
  groups: [
    {
      id: String,
      name: String,
      color: String,
      itemIds: [String],
    },
  ],
});

/**
 * Represents the application data (items and groups) for a user.
 */
export const UserData = mongoose.model<mongoose.Document>(
  "UserData",
  userDataSchema
);
