# Deno JWT example

It is a simple example for JWT with Deno.

## API endpoints

### Task

| Method     | URL                   | Description    |
| ---------- | --------------------- | -------------- |
| **GET**    | /api/v1/tasks         | Get all tasks  |
| **GET**    | /api/v1/tasks/:taskId | Get task by Id |
| **POST**   | /api/v1/tasks         | Add new task   |
| **PATCH**  | /api/v1/tasks/:taskId | Update a task  |
| **DELETE** | /api/v1/tasks/:taskId | Delete a task  |

### Auth

| Method   | URL                   | Description   |
| -------- | --------------------- | ------------- |
| **POST** | /api/v1/auth/register | User register |
| **POST** | /api/v1/auth/login    | User login    |
| **GET**  | /api/v1/auth/logout   | User logout   |

### User

| Method  | URL           | Description       |
| ------- | ------------- | ----------------- |
| **GET** | /api/v1/users | Get personal data |

## References

- [How to Implement JWT Authentication for CRUD APIs in Deno](https://www.loginradius.com/blog/engineering/guest-post/how-to-implement-jwt-authentication-in-deno/).

- [Build a Complete Deno CRUD RESTful API with MongoDB](https://codevoweb.com/deno-crud-restful-api-with-mongodb/)
