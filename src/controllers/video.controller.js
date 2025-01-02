import { asyncAwaitHandler } from '../utilities/asyncFuncHandler.js';
import apiError from '../utilities/apiErrorsHandler.js'
import apiResponse from '../utilities/apiResponseHandler.js';
import uploadFiles from '../utilities/fileUpload.js';
import { User } from '../models/users.models.js';
import mongoose from 'mongoose';
import {Video} from '../models/videos.models.js';

const uploadVideo = asyncAwaitHandler(async ( req,res ) =>{
    /*
     * check the user is login or not
     * take video details from user
     * take the localFilePath of the video and the thumbnail
     * put the localfilePath on cloudinary 
     * delete the files after upload on cloudinary
     * put those on database
     */

    
    

    try {
        const user = await User.findById(req.user._id).select(
            "-emailId -fullName -coverImage -password -refreshToken -watchHistory"
        );
        
        
        if(!user){
            throw new apiError(401, "User not found!!")
        }
        console.log(user);
        
        
    
        const { title, description } = req.body;
        if(!title){
            throw new apiError(401,"video upload failed!!")
        }

        
        
    
        const localVideoFile = await req.files?.videoFile?.[0].path
        const localThumbnailFile = await req.files?.thumbnail?.[0].path;
        
        if(!localVideoFile){
            throw new apiError(401,"video upload failed!!")
        }
        if(!localThumbnailFile){
            throw new apiError(500,"Something went wrong! thumbnail upload failed");
        }

        

        
        const cloudinaryVideoFile = await uploadFiles(localVideoFile);
        const cloudinarythumbnailFile = await uploadFiles(localThumbnailFile);
        
        
        if(!cloudinaryVideoFile){
                throw new apiError(500,"Something went wrong! video upload failed");
        }
        if(!cloudinarythumbnailFile){
                throw new apiError(500,"Something went wrong! thumbnail upload failed");
        }
        
        // console.table([user?.userName , title, description, localVideoFile, localThumbnailFile, cloudinaryVideoFile.url, cloudinarythumbnailFile.url]);

        const storedVideoDetails = await Video.create({
            videoFile: cloudinaryVideoFile.url,
            title: title,
            description: description,
            thumbnail: cloudinarythumbnailFile.url,
            owner: new mongoose.Types.ObjectId(user._id),
        })
        
        if(!storedVideoDetails){
            throw new apiError(404, "Unable to upload video")
        }
        console.log(`storedVideoDetails uploaded complete!!`);
        
        
        return res
        .status(200)
        .json(
            new apiResponse(201, storedVideoDetails, "Video uploaded Successfully!!")
        )
        
        
    } catch (error) {
        throw new apiError(400, error.message || `something went wrong to upload video!`);
        
    }
})

export { uploadVideo }