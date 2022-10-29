import { RouterContext, Status, Bson } from '../deps.ts';
import { Task } from '../models/task.ts';
import type { CreateTaskInput, UpdateTaskInput } from '../schema/task.ts';

const createTaskController = async ({
  request,
  response,
}: RouterContext<string>) => {
  try {
    const { title, content, status }: CreateTaskInput = await request.body()
      .value;

    // 確認 Task 是否已存在
    const taskExists = await Task.findOne({ title });
    if (taskExists) {
      response.status = Status.Conflict;
      response.body = {
        status: 'fail',
        message: 'Task with that title already exists',
      };
      return;
    }

    const createdAt = new Date();
    const updatedAt = createdAt;

    // 將資料儲存至 database，並取得該 task 的 object_id (unique)
    const taskId: string | Bson.ObjectId = await Task.insertOne({
      title,
      content,
      status,
      createdAt,
      updatedAt,
    });

    // 判斷是否成功儲存至 database
    if (!taskId) {
      response.status = Status.InternalServerError;
      response.body = { status: 'error', message: 'Error creating user' };
      return;
    }

    // 成功，回傳整份 task
    const task = await Task.findOne({ _id: taskId });
    response.status = Status.Created;
    response.body = { status: 'success', data: { task } };
  } catch (error) {
    response.status = Status.InternalServerError;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const updateTaskController = async ({
  params,
  request,
  response,
}: RouterContext<string>) => {
  try {
    const payload: UpdateTaskInput['body'] = await request.body().value;

    // 至 database 更新資料，並取得更新的詳細資訊
    const updatedInfo = await Task.updateOne(
      { _id: new Bson.ObjectId(params.taskId) },
      { $set: { ...payload, updatedAt: new Date() } },
      { ignoreUndefined: true }
    );

    // 透過比對成功資料的數量，判斷有無找到
    if (!updatedInfo.matchedCount) {
      response.status = Status.NotFound;
      response.body = {
        status: 'fail',
        message: 'No task with that Id exists',
      };
      return;
    }

    const updatedTask = await Task.findOne({ _id: updatedInfo.upsertedId });

    response.status = Status.OK;
    response.body = { status: 'success', data: { task: updatedTask } };
  } catch (error) {
    response.status = Status.InternalServerError;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const getTaskController = async ({
  params,
  response,
}: RouterContext<string>) => {
  try {
    const task = await Task.findOne({ _id: new Bson.ObjectId(params.taskId) });

    // 判斷是否有找到 task
    if (!task) {
      response.status = Status.NotFound;
      response.body = {
        status: 'fail',
        message: 'No task with that Id exists',
      };
      return;
    }

    response.status = Status.OK;
    response.body = {
      status: 'success',
      data: { task },
    };
  } catch (error) {
    response.status = Status.InternalServerError;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const getAllTasksController = async ({
  request,
  response,
}: RouterContext<string>) => {
  try {
    // 取得 URL 上的 Query 參數
    const page = request.url.searchParams.get('page');
    const limit = request.url.searchParams.get('limit');
    const intPage = page ? parseInt(page) : 1;
    const intLimit = limit ? parseInt(limit) : 10;
    const skip = (intPage - 1) * intLimit;

    // $match 特定欄位符合，空 Object 則為全部符合
    // $skip 跳過指定的數量
    // $limit 一次最多取出的數量
    const pipeline = [
      { $match: {} },
      {
        $skip: skip,
      },
      {
        $limit: intLimit,
      },
    ];

    // 使用 mongodb 的 aggregate 聚合來將符合條件的 task 取出
    const cursor = Task.aggregate(pipeline);
    const tasks = await cursor.toArray();

    response.status = Status.OK;
    response.body = {
      status: 'success',
      results: tasks.length,
      data: { tasks },
    };
  } catch (error) {
    response.status = Status.InternalServerError;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

const deleteTaskController = async ({
  params,
  response,
}: RouterContext<string>) => {
  try {
    const numberOfTask = await Task.deleteOne({
      _id: new Bson.ObjectId(params.taskId),
    });

    // 判斷是否有找到 task
    if (!numberOfTask) {
      response.status = Status.NotFound;
      response.body = {
        status: 'fail',
        message: 'No task with that Id exists',
      };
      return;
    }
    response.status = Status.NoContent;
  } catch (error) {
    response.status = Status.InternalServerError;
    response.body = { status: 'error', message: error.message };
    return;
  }
};

export {
  createTaskController,
  updateTaskController,
  getTaskController,
  getAllTasksController,
  deleteTaskController,
};
