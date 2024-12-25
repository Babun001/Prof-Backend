import { asyncAwaitHandler } from "../utilities/asyncFuncHandler.js";
import apiError from "../utilities/apiErrorsHandler.js";
import apiResponse from '../utilities/apiResponseHandler.js';
import { gmailValidation, userNameValidation, passwordValidation } from '../utilities/validation.js';
import { User } from '../models/users.models.js';
import uploadFiles from '../utilities/fileUpload.js';


const generateAccessAndRefreshToken = async (userId) =>{
    try {

        const user = await User.findOne(userId);
        if(!user){
            throw new apiError(404,"User not found!!");
        }
        const accessToken = await user.genarateAccessToken();
        const refreshToken = await user.genarateRefreshToken();

        user.refreshToken = refreshToken;
        user.save({
            validateBeforeSave: false
        });

        return {accessToken, refreshToken};
        
    } catch (error) {
        throw new apiError(500,"Something Went wrong! Unable to generate token!!")
    }
}


const userRegister = asyncAwaitHandler(async (req, res) => {
    const { userName, emailId, fullName, password } = req.body;
    if (userName === "" || emailId === "" || password === "") {
        throw new apiError(400, "All Fields are Required!!");
    }

    if (!gmailValidation(emailId) || !userNameValidation(userName) || !passwordValidation(password)) {
        throw new apiError(400, "Enter valid Credentials!!");
    }

    const existingUser = await User.findOne({
        $or: [{ userName }, { emailId }]
    })

    if (existingUser) {
        throw new apiError(402, "User Already Exist!!");
    }

    const avatarLocalPath = req.files?.avatar?.[0].path;
    const coverImageLocalPath = (req.files?.coverImage?.[0]) ? req.files?.coverImage?.[0].path : "";

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar is required!!");
    }

    const cloudinaryAvatar = await uploadFiles(avatarLocalPath);
    if (coverImageLocalPath) {
        var cloudinaryCoverImage = await uploadFiles(coverImageLocalPath);
    }

    if (!cloudinaryAvatar) {
        throw new apiError(400, "Unable to upload avatar!! Try again!")
    }

    const CreateUserData = await User.create({
        userName: userName.toLowerCase(),
        emailId: emailId,
        fullName: fullName,
        avatar: cloudinaryAvatar?.url,
        coverImage: cloudinaryCoverImage?.url || "",
        password: password
    })

    const createdUser = await User.findById(CreateUserData._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new apiError(500, "Something went wrong! Try again!!");
    }

    // console.log(createdUser);


    res.status(201).json(
        new apiResponse(200, "User Registered Successfully!!", createdUser)
    )

})

const userLogin = async (req, res) =>{
    const {userName, emailId, password} = req.body;
    if(!userName || !emailId || !password){
        throw new apiError(400, "all field required!!")
    }

    const user = await User.findOne({
        $or:[{userName},{emailId}]
    })

    if(!user){
        throw new apiError(404,"User not found!!");
    }

    const passwordCheck = await user.passwordCheck(password);

    if(!passwordCheck){
        throw new apiError(400,"Incorrect Password!!");
    }

    // console.log(passwordCheck);

    // generate a new refresh token
    // generate cookies
    // send response to user
    
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedIn = await User.findById(user._id).select(
        "-password -refreshToken"
    );

}

export {
    userRegister,
    userLogin
};