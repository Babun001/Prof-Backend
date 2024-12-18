const asyncAwaitHandler = (requestFunction) =>{
    (req,res,next)=>{
        Promise.resolve(requestFunction(req,res,next)).catch(err => next(err));
    }
};

export {asyncAwaitHandler};