import { Router, Status } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
} from '../controllers/task.ts';
import { signin, signup } from '../controllers/user.ts';
import { authorized } from '../middlewares/auth.ts';

const router = new Router();

// Auth
router
  .post('/api/signup', async (ctx) => {
    const { username, password } = await ctx.request.body().value;

    const _id = await signup(username, password);
    ctx.response.status = Status.Created;
    ctx.response.body = {
      message: 'User created',
      userId: _id,
      user: username,
    };
  })
  .post('/api/signin', async (ctx) => {
    const { username, password } = await ctx.request.body().value;

    try {
      const body = await signin(username, password);
      ctx.response.status = Status.OK;
      ctx.response.body = body;
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case 'Internal server error':
            ctx.response.status = Status.InternalServerError;
            ctx.response.body = { message: error.message };
            break;
          default:
            ctx.response.status = Status.NotFound;
            ctx.response.body = { message: error.message };
            break;
        }
      }
    }
  });

// Task
router
  .post('/api/tasks', authorized, async (ctx) => {
    const { name, isCompleted } = await ctx.request.body().value;
    const _id = await createTask(name, isCompleted);
    ctx.response.status = Status.OK;
    ctx.response.body = {
      message: 'Task created',
      id: _id,
      name: name,
      completed: isCompleted,
    };
  })
  .get('/api/tasks', authorized, async (ctx) => {
    const allTasks = await getAllTasks();
    ctx.response.status = Status.OK;
    ctx.response.body = { tasks: allTasks };
  })
  .get('/api/tasks/:taskId', authorized, async (ctx) => {
    const taskId = ctx.params.taskId!;
    try {
      const task = await getTaskById(taskId);
      ctx.response.status = Status.OK;
      ctx.response.body = { task: task };
    } catch (error) {
      if (error instanceof Error) {
        ctx.response.status = Status.NotFound;
        ctx.response.body = { message: error.message };
      }
    }
  })
  .patch('/api/tasks/:taskId', authorized, async (ctx) => {
    const taskId = ctx.params.taskId!;
    const { name, isCompleted } = await ctx.request.body().value;
    const task = await updateTaskById(taskId, name, isCompleted);
    ctx.response.status = Status.OK;
    ctx.response.body = { message: 'Updated task', task: task };
  })
  .delete('/api/tasks/:taskId', authorized, async (ctx) => {
    const taskId = ctx.params.taskId!;
    const task = await deleteTask(taskId);
    ctx.response.status = Status.OK;
    ctx.response.body = { message: 'Deleted task', task: task };
  });

export default router;
