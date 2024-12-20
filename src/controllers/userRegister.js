import {asyncAwaitHandler} from "../utilities/asyncFuncHandler.js";

const userRegister = asyncAwaitHandler(async(req, res) =>{
    res.status(200).json({
        message:"All right"
    })
})


export {userRegister};