const gmailValidation = (gmail) =>{
    
    return (!gmail)?false:
    (!gmail.includes("@") || !gmail.includes("."))?false:true;
}

const userNameValidation = (name) =>{
    name = name.trim(" ");
    return (!name)?false
    :   (name.length<=20)?true:false;
}


const passwordValidation = (pw) =>{
    return (!pw || pw.length<8 || pw.includes(" ") || !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/.test(pw)))? false: true;
}


export { gmailValidation, userNameValidation,  passwordValidation};