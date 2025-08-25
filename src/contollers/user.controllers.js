import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


//take ip for all user fields
//validate user ip for all fields
//check if user already exists
//save ip to database(create user object-create db entry)
//check whether user created
//send response
const registerUser= asyncHandler(async (req,res)=>{
    const {username,password,name}=req.body
    if([username,password,name].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are mandatory");
    }
    const existingUser= await User.findOne({
        $or:[{username}]
    })
    if(existingUser){
        throw new ApiError(409,"Given username already exists")
    }

    const user=await User.create({
        username,
        password,
        name
    });

    const createdUser=await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"Failed to register user");
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"Registered User successfully")
    )
    
}
)

export {registerUser}