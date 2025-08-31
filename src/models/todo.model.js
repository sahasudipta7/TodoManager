import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const todoSchema=new Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
        trim:true
    },
    complete:{
        type:Boolean,
        required:true,
        default:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    subTodos:[
        {
            type:Schema.Types.ObjectId,
            ref:"SubTodo",

        }
    ]
},{timestamps:true})



todoSchema.plugin(mongooseAggregatePaginate);

export const Todo=mongoose.model("Todo",todoSchema);

    

