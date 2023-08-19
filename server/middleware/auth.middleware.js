import AppError from "../utils/error.util.js";
import jwt from 'jsonwebtoken'


const isLoggedIn = (req,res,next)=>{
    const {token}= req.cookies;

    if(!token){
        return next(new AppError('Unauthenticated , please login again',404));
    }

    const userDetails = jwt.verify(token,process.env.JWT_SECRET);

    req.user = userDetails;

    next();
}


//atuhorised candidate logic 
const atuhorisedRoles=(...roles)=>(req,res,next)=>{
    //get all roles 
    const currentUserRoles = req.user.role

    if(!roles.includes(currentUserRoles)){
        return next(
            new AppError('You have not permission to access this route',500)
        )
    }

    next();
}

export{
    isLoggedIn,
    atuhorisedRoles
} ;