import { ObjectId } from 'https://deno.land/x/mongo@v0.31.1/mod.ts';
import database from '../database/connect.ts';
import { TaskSchema } from '../schema/task.ts';

const Tasks = database.collection<TaskSchema>('tasks');

export const createTask = async (name: string, isCompleted: boolean) => {
  const _id = await Tasks.insertOne({
    name,
    isCompleted,
  });
  return _id;
};

export const getAllTasks = async () => {
  const allTasks = await Tasks.find({}).toArray();
  return allTasks;
};

export const getTaskById = async (id: string) => {
  const task = await Tasks.findOne({ _id: new ObjectId(id) });
  if (!task) {
    throw new Error(`no task with Id: ${id}`);
  }
  return task;
};

export const updateTaskById = async (
  id: string,
  name: string,
  isCompleted: boolean
) => {
  const task = await Tasks.updateOne(
    { _id: new ObjectId(id) },
    { $set: { name: name, isCompleted: isCompleted } }
  );
  return task;
};

export const deleteTask = async (id: string) => {
  const task = await Tasks.deleteOne({ _id: new ObjectId(id) });
  return task;
};
