import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Todo } from "../models/todo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const createTodo = asyncHandler(async(req,res)=>{
    const {title} = req.body
    const user=await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(400,"Unauthorized Request")
    }
    const existingTodo = await Todo.aggregate([
  {
    $match: {
      author: user._id,       // match only todos created by this user
      title: title            // match by the same title provided in request
    }
  },
  {
    $count: "todoCount"       // count the matched todos
  }
])
     
   if (existingTodo.length > 0 && existingTodo[0].todoCount > 0) {
        throw new ApiError(409, "A Todo with this title already exists.");
    }
    const todo=await Todo.create({
        title,
        author:user._id
    })
    const createdTodo=await Todo.findById(todo._id)
    if(!createdTodo){
        throw new ApiError(500,"Failed to create Todo")
    }
    return res.status(200).json(new ApiResponse(200,{
        createdTodo
    },"Created Todo List successfully"))
})

const getTodo = asyncHandler(async(req,res)=>{
  const {title} = req.body
  const user=await User.findById(req.user?._id);
  if(!user){
      throw new ApiError(400,"Unauthorized Request")
  }
  try {
    const reqdTodo = await Todo.aggregate([
      {
        $match:{
            author:user._id,
            title:title
        }
      }
    ])
    if(reqdTodo.length==0){
      throw new ApiError(404,"Requested Todo doesn't exist")
    }
    return res.status(200).json(new ApiResponse(200,{reqdTodo},"Fetched Requested Todo Successfully"))
  } catch (error) {
      throw new ApiError(500,"There was an issue fetching requested Todo.")
  }

})

const toggleTodoComplete = asyncHandler(async(req,res)=>{
  try {
    const {title} = req.body
    const user=await User.findById(req.user?._id)
    if(!user){
      throw new ApiError(400,"Unauthorized Request")
    }
    const reqdTodo = await Todo.findOne({
      author:user?._id,
      title
    })
    if(!reqdTodo){
      throw new ApiError(404,"Requested Todo doesn't exist")
    }
    reqdTodo.complete=!reqdTodo.complete
    await reqdTodo.save()
    return res.status(200).json(new ApiResponse(200,{},"Toggled Todo Complete successfully"))
  } catch (error) {
    throw new ApiError(500,error.message||"Failed to toggle Todo complete")
  }
})



export { createTodo,getTodo,toggleTodoComplete }