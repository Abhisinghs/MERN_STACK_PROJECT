
//define method for error middle ware 
const errorMiddleware = (err,req,res,next)=>{
    // define fall back 
    err.statusCode = err.statusCode || 500;
    err.message= err.message || "something went wrong!";

    return res.status(400).json({
        success:false,
        message:err.message,
        stack:err.stack
    })
}


// exports 
export default errorMiddleware;