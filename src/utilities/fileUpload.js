import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFiles = async(localFilePath) =>{
    try {
        if(!localFilePath)return null;
        const response = await cloudinary.uploader.upload(localFilePath,{resource_type:'auto'});
        console.log("File uploaded Successfully!");
        console.log("File path => ", response.url);
        return response;        
    } catch (error) {
        fs.unlink(localFilePath);
        return null;
    }
}

export {uploadFiles};