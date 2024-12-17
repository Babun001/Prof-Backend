class apiResponse{
    constructor(statusCode, message='Success', data){
        this.statusCode = statusCode
        this.data = data
        this.success = statusCode < 400
        this.message = message
    }
}