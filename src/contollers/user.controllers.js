import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500,"Failed to generate access token and refresh token")
    }

}

const registerUser= asyncHandler(async (req,res)=>{
//take ip for all user fields
//validate user ip for all fields
//check if user already exists
//save ip to database(create user object-create db entry)
//check whether user created
//send response
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

const loginUser=asyncHandler(async(req,res)=>{
    //take ip for user fields username and password
    //validate these user fields(not empty)
    //check if the user exists
    //generate access and refresh tokens 
    //send cookies
    //send response 
    const {username,password}=req.body
    if(!username||!password){
        throw new ApiError(400,"username and password are required.")
    }
    const user =await User.findOne(password)
    if(!user){
        throw new ApiError(404,"User not found.")
    }

    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Incorrect Password")
    }

    const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).
    cookie("accessToken",accessToken,options).
    cookie("refreshToken",refreshToken,options).
    json(new ApiResponse(200,{
        user:loggedInUser,accessToken,refreshToken
    },"Login was successfull"))
})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{refreshToken:undefined}
        },
        {
            new:undefined
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).
    json(new ApiResponse(200,{},"User logged out"));
    
})

export {registerUser,loginUser,logoutUser}