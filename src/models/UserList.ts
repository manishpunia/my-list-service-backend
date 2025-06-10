import mongoose, { Document, Schema } from 'mongoose';

export interface IUserList extends Document {
  userId: string;
  contentIds: string[];
}

const UserListSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  contentIds: { type: [String], default: [] },
});

// Index for fast lookups by userId
//UserListSchema.index({ userId: 1 });

const UserList = mongoose.model<IUserList>('UserList', UserListSchema);

export default UserList;