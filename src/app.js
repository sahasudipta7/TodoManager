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
app.use("/api/v1/users",userRouter);
app.use("/api/v1/todos",todoRouter);
app.use("/api/v1/subTodos",subTodoRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the TodoManager API 🚀",
    docs: "/api/v1"
  });
});

// app.get("/", (req, res) => {
//   res.send("✅ TodoManager API is running!");
// });//new
export {app};