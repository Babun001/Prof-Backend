import {asyncAwaitHandler} from "../utilities/asyncFuncHandler.js";
import apiError from "../utilities/apiErrorsHandler.js";
import apiResponse from '../utilities/apiResponseHandler.js';
import {gmailValidation, userNameValidation,  passwordValidation} from '../utilities/validation.js';


const userRegister = asyncAwaitHandler(async(req, res) =>{
    const {userName, emailId, fullName,  password} = req.body;
    if(userName === "" || emailId === "" ||  password === ""){
        throw new apiError(409, "All Fields are Required!!");
    }

    if(!gmailValidation(emailId)){
        throw new Error(401, "Enter Valid mail iD!");
    }else{
        if(!userNameValidation(userName)){
            throw new Error(402, "Enter Valid UserName!");
        }else{
            if(!passwordValidation(password)){
                throw new Error(403, `Enter Valid password!!
1. Password must have upper case and lower case letters.
2. Password must have special characters.
3. Password should not contant any space.
4. Password should be greater than 8 characters.
5. Password must have numaric characters.
                    `)
            }else{
                console.log("Validation Successful!");
                throw new apiResponse(200,"Successfull!!");
                
            }
        }
    }


})

    
export {userRegister};