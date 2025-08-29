import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

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
        throw new ApiError(409,"Given username already exists.")
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
    const user =await User.findOne({username})
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

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized Request");
    }
    const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    if(!decodedToken){
        throw new ApiError(401,"Unauthorized Request")
    }
    const user=await User.findById(decodedToken?._id)
    if(!user){
        throw new ApiError(401,"Invalid Refresh Token")
    }
    if(user?.refreshToken!==incomingRefreshToken){
        throw new ApiError(401,"Refresh token has expired or is invalid")
    }
    const Options={
        httpOnly:true,
        secure:true
    }
    const {accessToken,newRefreshToken}=await generateAccessTokenAndRefreshToken(user._id)
    res.
    status(200).
    cookie("accessToken",accessToken,Options).
    cookie("refreshToken",newRefreshToken,Options).
    json(200,{
        accessToken,refreshToken:newRefreshToken
    },"Access Token Refreshed")

})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    //take old and new password ip from user
    //use auth middleware to find user(user can only change password if logged in)
    //check whether old password is correct
    //save new password
    const {oldPassword,newPassword} = req.body
    const user=await User.findById(req.user?._id)
    console.log("User from middleware:", req.user);
    const isPasswordCorrect=await user?.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400,"Incorrect Old Password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})
    res.status(200).json(new ApiResponse(200,{},"Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    res.status(200).json(new ApiResponse(200,req.user,"Fetched current user successfully"))
})

//#

// const getUserTodo = asyncHandler(async(req,res)=>)

export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser}