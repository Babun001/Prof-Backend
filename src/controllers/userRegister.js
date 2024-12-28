import { asyncAwaitHandler } from "../utilities/asyncFuncHandler.js";
import apiError from "../utilities/apiErrorsHandler.js";
import apiResponse from '../utilities/apiResponseHandler.js';
import { gmailValidation, userNameValidation, passwordValidation } from '../utilities/validation.js';
import { User } from '../models/users.models.js';
import uploadFiles from '../utilities/fileUpload.js';


const generateAccessAndRefreshToken = async (userId) => {
    try {

        const user = await User.findById(userId);
        if (!user) {
            throw new apiError(404, "User not found!!");
        }

        const accessToken = user.genarateAccessToken();
        const refreshToken = user.genarateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({
            validateBeforeSave: false
        });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new apiError(500, "Something Went wrong! Unable to generate token!!")
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

const userLogin = async (req, res) => {
    const { userName, emailId, password } = req.body;
    if (!userName || !emailId || !password) {
        throw new apiError(400, "all field required!!")
    }

    const user = await User.findOne({
        $or: [{ userName }, { emailId }]
    })

    if (!user) {
        throw new apiError(404, "User not found!!");
    }

    const passwordCheck = await user.passwordCheck(password);

    if (!passwordCheck) {
        throw new apiError(400, "Incorrect Password!!");
    }

    // console.log(passwordCheck);

    // generate a new refresh token
    // generate cookies
    // send response to user

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedIn = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const selector = {
        httpOnly: false,
        secure: true
    }


    return res
        .status(200)
        .cookie("accessToken", accessToken, selector)
        .cookie("refreshToken", refreshToken, selector)
        .json(
            new apiResponse(200, {
                user: accessToken, refreshToken, loggedIn
            }, "User LoggedIn successfully!!!")
        )

}

const userLogOut = asyncAwaitHandler(async (req, res) => {


    const loggedOut = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )



    const selector = {
        httpOnly: false,
        secure: true
    }
    return res
        .status(201)
        .clearCookie("accessToken", selector)
        .clearCookie("refreshToken", selector)
        .json(
            new apiResponse(200, loggedOut, "LoggedOut successfully")
        )
});

//// if user wants to change the old password
const changeOldPassword = asyncAwaitHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new apiError(404, "User not found!!");
        }

        const checkPass = await user.passwordCheck(oldPassword);
        if (!checkPass) {
            throw new apiError(404, "Old password is incorrect!!");
        }

        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        return res.status(201).json(new apiResponse(201, "Password changed Successful!!"))
    } catch (error) {
        throw new apiError(404, "error in change Old Password method in userRegister line number 174");
    }
})

//// what if the user forget the password
const forgetPassword = asyncAwaitHandler(async (req, res) => {
    //// Alog
    /*  1. generate a new token
        2. send it via smtp server
        3. verify the token is correct or not
        4. if yes then reset the password with new password    
    */
})

//// change the avatar or coverImage
const changeAvatar = asyncAwaitHandler(async (req, res) => {
    /**
     * 0. check the user is logged in or not === he can change the avatar iff logged in
     * 1. get the updated avatar using multer
     * 2. upload it on cloudinary
     * 3. replace the user.avatar = newAvatar link
     * 4. save and update the data
     * 5. send response to user
     */

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new apiError(404, "User not found!!!")
    }

    const updatedAvatarLocalPath = req.files?.updatedAvatar?.[0].path;
    if (!updatedAvatarLocalPath) {
        throw new apiError(401, "New avatar path not found!!");
    }

    const cloudinaryNewAvatarPath = await uploadFiles(updatedAvatarLocalPath);
    if (!cloudinaryNewAvatarPath) {
        throw new apiError(401, "failed to upload new avatar to cloudinary!!!");
    }

    user.avatar = cloudinaryNewAvatarPath?.url;
    user.save({ validateBeforeSave: false })

    return res.status(200).json(new apiResponse(200, "Avatar changed successfully"))
})



////if the user wants to change the cover image 

const changeCoverImage = asyncAwaitHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new apiError(404, "User not found!!!")
    }

    const updatedCoverImageLocalPath = req.files?.updatedCoverImage?.[0].path;
    if (!updatedCoverImageLocalPath) {
        throw new apiError(401, "New avatar path not found!!");
    }

    const cloudinaryNewCoverImagerPath = await uploadFiles(updatedCoverImageLocalPath);
    if (!cloudinaryNewCoverImagerPath) {
        throw new apiError(401, "failed to upload new avatar to cloudinary!!!");
    }

    user.avatar = cloudinaryNewCoverImagerPath?.url;
    user.save({ validateBeforeSave: false })

    return res.status(200).json(new apiResponse(200, "Cover Image changed successfully"))
})

const getChannel = asyncAwaitHandler(async (req, res) => {
    const { username } = req.params;
    if (!(username?.trim())) {
        throw new apiError(401, "Channel not found|| error in userRegister.js line 267")
    }

    /** sample data for better understanding
     * {"_id":{"$oid":"676ecff08903415c85fc3241"},
     * "userName":"abcdefg",
     * "emailId":"abcdefg@gmail.com",
     * "fullName":"abc defg",
     * "avatar":"http://res.cloghpli.jpg",
     * "coverImage":"",
     * "password":"$2ClNKiGAzO8iy6",
     * "watchHistory":[],
     * "createdAt":{"$date":{"$numberLong":"1735315440310"}},
     * "updatedAt":{"$date":{"$numberLong":"1735315690204"}},
     * "__v":{"$numberInt":"0"},
     * "refreshToken":"eyJhbGciOiJIUzI1NiIsInRDQ1NJ1oiLIs_py6nDR2c"}
     */

    const channel = await User.aggregate([
        {
            $match: {
                userName: username.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscribers",
                localField: "_id",
                foreignField: "channelName",
                as: "SubscriberCounts"
            }
        },
        {
            $lookup: {
                from: "subscribers",
                localField: "_id",
                foreignField: "subscriber",
                as: "SubscribedChannelCounts"
            }
        },
        {
            $addFields:{
                subscriberCount:{
                    $size:"$SubscriberCounts"
                },
                channelSubscribedCounts:{
                    $size: "$SubscribedChannelCounts"
                },
                subscribedORnot: {
                    $cond:{
                        if: {$in: [req.user?._id, "$SubscriberCounts"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project : {
                userName: 1,
                avatar: 1,
                coverImage: 1,
                subscriberCount: 1,
                channelSubscribedCounts: 1,
                subscribedORnot: 1,
            }
        }
    ])

    if(!channel?.length){
        throw new apiError(402,"channel not found!!")
    }

    return res.status(200).json(
        new apiResponse(200, channel?.[0], "Channel found!!")
    )
    

})


export {
    userRegister,
    userLogin,
    userLogOut,
    changeOldPassword,
    forgetPassword,
    changeAvatar,
    getChannel
};