import {asyncAwaitHandler} from "../utilities/asyncFuncHandler.js";
import apiError from '../utilities/apiErrorsHandler.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.models.js';




export const jwtCheck = asyncAwaitHandler(async (req,_,next) =>{
    try {
        const token = req.cookies?.accessToken || req.header('Authorization').replece("Bearer ","");
        if(!token){
            throw new apiError(403,"Token not found!!");
        }

        const verifyToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

        if(!verifyToken){
            throw new apiError(403,"Token verify failed!!");
        }

        const user = await User.findById(verifyToken._id);

        req.user = user;
        next();
                
    } catch (error) {
        throw new apiError(402, "Something went wrong in jwt token!!")
    }
})