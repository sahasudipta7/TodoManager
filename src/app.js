import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({
    limit:"16kb"
}))
app.use(urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import todoRouter from "./routes/todo.routes.js";
import subTodoRouter from "./routes/subTodo.routes.js"
import { registerUser } from "./contollers/user.controllers.js";
app.use("/api/v1/users",userRouter);
app.use("/api/v1/todos",todoRouter);
app.use("/api/v1/subTodos",subTodoRouter);
//nc
app.get("/", (req, res) => {
  res.send(`
    <h1> Welcome to TodoManager Backend API</h1>
    <p>Use <code>/api/v1/users</code>, <code>/api/v1/todos</code>, and <code>/api/v1/subTodos</code> as base paths.</p>

    <h2> User Routes</h2>
    <ul>
      <li>POST /api/v1/users/register - Register a new user</li>
      <li>POST /api/v1/users/login - Login user</li>
      <li>POST /api/v1/users/logout - Logout user (requires JWT)</li>
      <li>POST /api/v1/users/refresh-token - Refresh JWT token</li>
      <li>POST /api/v1/users/changeUserPassword - Change password ( requires JWT)</li>
      <li>POST /api/v1/users/getCurrentUser - Get logged in user ( requires JWT)</li>
      <li>POST /api/v1/users/updateUsername - Update username ( requires JWT)</li>
      <li>POST /api/v1/users/getAllUserTodos - Get all todos for a user ( requires JWT)</li>
    </ul>

    <h2> Todo Routes</h2>
    <ul>
        <li>POST /api/v1/todos/createTodo - Create a new todo ( requires JWT)</li>
        <li>POST /api/v1/todos/getTodo - Get all todos for a user ( requires JWT)</li>
        <li>POST /api/v1/todos/toggleTodoComplete - Mark todo as complete/incomplete ( requires JWT)</li>
        <li>POST /api/v1/todos/renameTodo - Rename a todo ( requires JWT)</li>
        <li>POST /api/v1/todos/deleteTodo - Delete a todo ( requires JWT)</li>
    </ul>


    <h2> SubTodo Routes</h2>
    <ul>
        <li>POST /api/v1/subTodos/createSubTodo - Create a new sub-todo ( requires JWT)</li>
        <li>POST /api/v1/subTodos/toggleSubTodoComplete - Toggle completion status of a sub-todo ( requires JWT)</li>
        <li>POST /api/v1/subTodos/getSubTodo - Get all sub-todos for a todo ( requires JWT)</li>
        <li>POST /api/v1/subTodos/deleteSubTodo - Delete a sub-todo ( requires JWT)</li>
        <li>POST /api/v1/subTodos/updateSubTodoContent - Update sub-todo content ( requires JWT)</li>
    </ul>

    <p> Test these endpoints using Postman, Thunder Client, or curl.</p>
  `);
});





export {app};