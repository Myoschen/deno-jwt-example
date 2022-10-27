import { z } from '../deps.ts';

export const params = {
  params: z.object({
    taskId: z.string(),
  }),
};

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    content: z.string({
      required_error: 'Content is required',
    }),
    status: z.string({
      required_error: 'Status is required',
    }),
  }),
});

export const getTaskSchema = z.object({
  ...params,
});

export const updateTaskSchema = z.object({
  ...params,
  body: z
    .object({
      title: z.string(),
      content: z.string(),
      status: z.string(),
    })
    .partial(),
});

export const deleteTaskSchema = z.object({
  ...params,
});

export type CreateTaskInput = z.TypeOf<typeof createTaskSchema>['body'];
export type GetTaskInput = z.TypeOf<typeof getTaskSchema>['params'];
export type UpdateTaskInput = z.TypeOf<typeof updateTaskSchema>;
export type DeleteTaskInput = z.TypeOf<typeof deleteTaskSchema>['params'];
