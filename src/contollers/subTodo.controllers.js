import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Todo } from "../models/todo.model.js";
import { SubTodo } from "../models/subTodo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const createSubTodo = asyncHandler(async(req,res)=>{
    try {
        const {title,content} = req.body
        const user=await User.findById(req.user?._id)
        if(!user){
            throw new ApiError(400,"Unauthorized Request")
        }
        const reqdTodo = await Todo.findOne({ author: user._id, title });
        if (!reqdTodo) {
            throw new ApiError(404, "Requested Todo doesn't exist");
        }
        const subTodo=await SubTodo.create({
            content
        })
    
        const createdSubTodo = await SubTodo.findById(subTodo._id)
        if(!createdSubTodo){
            throw new ApiError(500,"Failed to create subTodo")
        }
    
        reqdTodo.subTodos.push(createdSubTodo._id)
        reqdTodo.complete = false
        await reqdTodo.save();
        return res.status(200).json(new ApiResponse(200,{createdSubTodo},"created Sub-todo successfully"))
    } catch (error) {
        throw new ApiError(500,error.message || "An error occured while creating the Sub-todo")
    }    
})

const toggleSubTodoComplete = asyncHandler(async(req,res)=>{
    try {
        const {title,content} = req.body
        const user=await User.findById(req.user?._id)
        if(!user){
            throw new ApiError(400,"Unauthorized Request")
        }
        const reqdTodo = await Todo.findOne({ author: user._id, title });
        if(!reqdTodo) {
            throw new ApiError(404, "Requested Todo doesn't exist");
        }
        let foundSubTodo = undefined
        for (const subTodoId of reqdTodo.subTodos){
            let subTodo=await SubTodo.findById(subTodoId)
            if(subTodo?.content===content){
                subTodo.complete = !subTodo.complete
                await subTodo.save()
                foundSubTodo = subTodo;
                break; 
            }
        }
        if (!foundSubTodo) {
            throw new ApiError(404, "No such subTodo exists");
        }
        return res.status(200).json(new ApiResponse(200,{},"Toggled subTodo complete successfully"))
    } catch (error) {
        throw new ApiError(500,error.message || "There was an error performing toggle complete operation")
    }
})

const deleteSubTodo = asyncHandler(async(req,res)=>{
    try {
        const {title,content} = req.body
        const user = await User.findById(req.user?._id)
        if(!user){
            throw new ApiError(400,"Unauthorized Request")
        }
        const reqdTodo = await Todo.findOne({
            author:user._id,
            title
        })
        if(!reqdTodo){
            throw new ApiError(404,"Requested Todo doesn't exist")
        }
        let foundSubTodo = undefined
        for (const subTodoId of reqdTodo.subTodos){
            let subTodo=await SubTodo.findById(subTodoId)
            if(subTodo?.content===content){
                foundSubTodo = subTodo;
                const index = reqdTodo.subTodos.indexOf(subTodoId);
                reqdTodo.subTodos.splice(index,1)
                await SubTodo.findByIdAndDelete(subTodo._id)
                await reqdTodo.save()
                break; 
            }
        }
        if (!foundSubTodo) {
            throw new ApiError(404, "No such subTodo exists");
        }
        return res.status(200).json(new ApiResponse(200,{},"Deleted subtodo successfully"))
    } catch (error) {
        throw new ApiError(500,error.message||"Failed to delete subTodo")
    }
})

export { createSubTodo,toggleSubTodoComplete,deleteSubTodo }