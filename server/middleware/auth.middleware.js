import AppError from "../utils/error.util.js";


const isLoggedIn=(req,res,next)=>{
    const {token}= req.cookies;

    if(!token){
        return next(new AppError('Unauthenticated , please login again',404));
    }

    const userDetails = jwt.verfy(token,process.env.JWT_SECRET);

    req.user = userDetails;

    next();
}

export default isLoggedIn;