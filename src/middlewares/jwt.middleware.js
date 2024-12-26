import asyncAwaitHandler from "../utilities/asyncFuncHandler.js";
import apiError from '../utilities/apiErrorsHandler.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.models.js';




export const jwtCheck = asyncAwaitHandler(async (req,res,next) =>{
    try {
        const token = await req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "");
        if(!token){
            throw new apiError(401, "tokens are not available!!");
        }
        const checkJWT = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        if(!checkJWT){
            throw new apiError(401, "Unauthorized user!!");
        }
    
        const user = User.findById(checkJWT._id).select("-password -refreshToken");
        if(!user){
            throw new apiError(401, "Unauthorized user!!");
        }
        req.user = user;
        next();

    } catch (error) {
        throw new apiError(401,error?.message || "Internal Server Error to check jwt Authentication!!");
    }
})