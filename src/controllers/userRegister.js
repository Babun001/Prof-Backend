import {asyncAwaitHandler} from "../utilities/asyncFuncHandler.js";

const userRegister = asyncAwaitHandler((req, res) =>{
    res.status(200).json({
        message:"You are awesome"
    })
})

export {userRegister};