class apiError extends Error{
    constructor(statusCode,message="SWW",errors=[],stack=''){
        super(message)
        this.message = message
        this.data = null
        this.errors = errors
        this.statusCode = statusCode
        this.success = false

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
