//this file basically for define generic code that used many places 

//define calss for all field are required 

class AppError extends Error{
    // define constructor because when object is create it call itself 
    constructor(message,statusCode){
       super(message);

       this.statusCode=statusCode;
       Error.captureStackTrace(this,this.constructor); 
       //captureStackTrace method ye method batata hai ki acutally kha se tumara code fata hai 
       //kis folder ki kis file me error aya hai 
    }
}


export default AppError;