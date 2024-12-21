import {asyncAwaitHandler} from "../utilities/asyncFuncHandler.js";
import apiError from "../utilities/apiErrorsHandler.js";
import apiResponse from '../utilities/apiResponseHandler.js';
import {gmailValidation, userNameValidation,  passwordValidation} from '../utilities/validation.js';
import {User} from '../models/users.models.js';
import uploadFiles  from '../utilities/fileUpload.js' ;

const userRegister = asyncAwaitHandler(async(req, res) =>{
    const {userName, emailId, fullName,  password} = req.body;
    if(userName === "" || emailId === "" ||  password === ""){
        throw new apiError(400, "All Fields are Required!!");
    }

    if (!gmailValidation(emailId) || !userNameValidation(fullName) || !passwordValidation(password)){
        throw new apiError(400, "Enter Valid Credentials");
    }

    // const existingUser = User.findOne({userName} && {emailId})

    // if(existingUser){
    //     throw new apiError(409, "User or mail is already exist!!");
    // }

    const avatarLocalPath = req.files?.Avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new apiError(400, "Avatar is required!!");
    }

    const avatar = await uploadFiles(avatarLocalPath);
    const coverImage = await uploadFiles(coverImageLocalPath);

    if(!avatar) {
        throw new apiError(400, "Avatar is required!!");
    }
    
    const user = await User.create({
        userName : userName,
        emailId : emailId,
        fullName : fullName,
        avatar : avatar.url,
        coverImage : coverImage.url || "",
        password : password
    })

    const createdUser = User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new apiError(500, "Something went wrong! Unable to register user!!");
    }

    return res.status(200).json(
        new apiResponse(200,createdUser, "User Registered Successfully!!")
    )

})

    
export {userRegister};