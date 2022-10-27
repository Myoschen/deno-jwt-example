import database from '../utils/connectDB.ts';
import { ObjectId } from '../deps.ts';

export interface UserSchema {
  _id: ObjectId;
  username: string;
  password: string;
  email: string;
  role: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const User = database.collection<UserSchema>('users');

// TODO comment to createIndexes
// To keep the consistency of the data in the collection,
// we added a unique constraint on the email field to ensure
// that no two users end up with the same email addresses.
User.createIndexes({
  indexes: [{ name: 'unique_email', key: { email: 1 }, unique: true }],
});
