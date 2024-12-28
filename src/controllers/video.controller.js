import { asyncAwaitHandler } from '../utilities/asyncFuncHandler.js';
import apiError from '../utilities/apiErrorsHandler.js'
import apiResponse from '../utilities/apiResponseHandler.js';
import uploadFiles from '../utilities/fileUpload.js';

import {Video} from '../models/videos.models.js';

const uploadVideo = asyncAwaitHandler(async ( req,res ) =>{
    /*
     * check the user is login or not
     * take the localFilePath of the video and the thumbnail
     * put the localfilePath on cloudinary 
     * delete the files after upload on cloudinary
     * put those on database
     */

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
    
    // const storedVideoDetails = await Video.create({
    //     videoFile:,
    //     title:,
    //     description:,
    //     thumbnail:,
    //     owner:,
    // })
    

    
    
    
    
})

export { uploadVideo }