import { Router } from '../deps.ts';
import {
  getTaskController,
  getAllTasksController,
  createTaskController,
  updateTaskController,
  deleteTaskController,
} from '../controllers/task.ts';
import { createTaskSchema, updateTaskSchema } from '../schema/task.ts';
import validate from '../middlewares/validate.ts';

// 創建 Router instance
const router = new Router();

router.get<string>('/', getAllTasksController);
router.post<string>('/', validate(createTaskSchema), createTaskController);
router.patch<string>(
  '/:taskId',
  validate(updateTaskSchema),
  updateTaskController
);
router.get<string>('/:taskId', getTaskController);
router.delete<string>('/:taskId', deleteTaskController);

export default router;
