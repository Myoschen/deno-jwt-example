import { ObjectId } from '../deps.ts';
import database from '../utils/connectDB.ts';

export interface TaskSchema {
  _id?: ObjectId;
  title: string;
  content: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Task = database.collection<TaskSchema>('tasks');
