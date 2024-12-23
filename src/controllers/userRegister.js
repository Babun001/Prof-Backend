import { asyncAwaitHandler } from "../utilities/asyncFuncHandler.js";
import apiError from "../utilities/apiErrorsHandler.js";
import apiResponse from '../utilities/apiResponseHandler.js';
import { gmailValidation, userNameValidation, passwordValidation } from '../utilities/validation.js';
import { User } from '../models/users.models.js';
import uploadFiles from '../utilities/fileUpload.js';

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

    // const createdUser = await User.findById(CreateUserData._id).select(
    //     "-password -refreshToken"
    // )

    console.log(CreateUserData);
    


    // console.log({userName, emailId, fullName, cloudinaryAvatar, cloudinaryCoverImage, password});




})


export { userRegister };