const gmailValidation = (gmail) =>{
    
    return (!gmail)?false:
    (!gmail.includes("@") || !gmail.includes("."))?false:true;
}

const userNameValidation = (name) =>{
    return (name.includes(" ") || name.length>10)?false:true;
}


const passwordValidation = (pw) =>{
    return (!pw || pw.length<8 || pw.includes(" ") || !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/.test(pw)))? false: true;
}



export { gmailValidation, userNameValidation,  passwordValidation};