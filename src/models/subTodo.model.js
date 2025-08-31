import mongoose,{Schema} from "mongoose";

const subTodoSchema=new Schema({
    content:{
        type:String,
        required:true
    },
    complete:{
        type:Boolean,
        required:true,
        default:false
    }

},{timestamps:true})

export const SubTodo=mongoose.model("SubTodo",subTodoSchema);

