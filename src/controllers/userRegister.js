import {asyncAwaitHandler} from "../utilities/asyncFuncHandler.js";
import apiError from "../utilities/apiErrorsHandler.js"
const userRegister = asyncAwaitHandler(async(req, res) =>{
    const {userName, emailId, fullName,  password} = req.body;
    if(userName ==="" || emailId==="" ||  password===""){
        throw new apiError(409, "All Fields are Required!!");
    }

    console.log(userName);
    
    
})


export {userRegister};