//Here we cover only logic part 
// In this controller file we only make function or module and use in routers file 
//import module form different file 
import 'dotenv/config'
import userData from '../models/user.model.js'
import AppError from '../utils/error.util.js'
import cloudinary from 'cloudinary'
import fs from 'fs/promises'

// define cookieOptions because we user multiple places
const cookieOptions={
    maxAge:7*24*60*60*1000,  //7 days 
    httpOnly:true,
    secure:true
}


// define functions 
const register = async(req,res,next)=>{
    //get data from req 
    const {fullName,email,password} = req.body;

    try{
         //check all fields are full full or not 
        if(!fullName || !email || !password){
            // go to utils file we define AppError 
            return next(new AppError('All fields are required',400));

            // using next it go to app.js file and we define a errormiddleware to handle this error for generic code 
        }

        // now check user exist or not at controller level  
        const userExists= await userData.findOne({email});
        if(userExists){
            return next(new AppError('Email already Exists!',404));
        }

        
        // now we store user data in database but in two step process 
        // 1.)store in DB first 
        const User = await userData.create({
            fullName,
            email,
            password,
            avtar:{
                public_id:'http',
                secure_url:'demo url'
            }
        })
        
        // if data dosen't store in Db
        if(!User){
            return next(new AppError('user registration failed,Please try!',404));
        }

        console.log('object');
        console.log(req.file);
        // 2.step 
        //TODO: file upload (we upload the file on third party app so our data can safe )
        if(req.file){
            console.log(req.file);
            try{
                const result =  await cloudinary.v2.uploader.upload(req.fiel.path,{
                    folder:'lms',
                    width:250,
                    height:250,
                    gravity:'faces',
                    crop:'fill'
                })

                if(result){
                    user.avtar.pubilc_id=result.public_id;
                    user.avtar.secure_url=result.secure_url;

                    //remove file from server 
                    // fs.rm(`uploads/${req.file.filename}`)
                }
            }catch(e){
                return next(
                    new AppError(e.message||'File not uploaded, please try again',500)
                )
            }
        }

        //store again to Db
        await User.save();

        User.password=undefined; //because no need to send password to user because it may be hack to other party 

        // after register no need to refer the login page 
        // after registration we direct allow to login to user 

        // 1.)token generate 
        const token = await User.generateJWTToken();  //this method define in user.model

        //set cookie 
        res.cookie('token',token,cookieOptions);

        //send success message to user 
        return res.status(201).json({
            success:true,
            message:'User registered successfully',
            User
        })
    }catch(err){
        return res.status(400).json({
            success:false,
            message:`Error while registration ${err.message}`
        })
    }
}

const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
    
        //check all fields 
        if(!email || !password){
            return next(new AppError('All fields are required ',404));
        }
    
        // we get the user detail to login 
        const user=await user.findOne({
            email,
        }).select('+password');  //get password explicitly  using select becuase in user model we select : false 
    
        // authenticate user 
        if(!user || !user.comparePassword(password)){
            return next(new AppError('Email or password does not match',404))
        }
    
    
        // create token that allow to do activity in app 
        const token = await user.generateJWTToken();
        user.password=undefined;  //becuase don't send password any situation
    
        res.cookie('token',token,cookieOptions); //set cookie
    
        //send success message
        res.status(200).json({
            success:true,
            message:'User login sccussefully'
        })
    }catch(err){
        return next(new AppError(e.message,500));
    }
}

const logout = (req,res)=>{
    //the simple logic of logout delete the cookie from browser
    res.cookie('token',null,{
        httpOnly:true,
        secure:true,
        maxAge:0
    })

    res.status(200).json({
        success:true,
        message:'User logged out successfully'
    })

}

const getProfile = async(req,res,next)=>{
    // get user data 
    try{
        const userId=req.user.id;  //go to auth.middleware to get user id 
        const user=await userData.findById(userId);

        res.status(200).json({
            success:true,
            message:'User details',
            user
        })
    }catch(err){
        return next(new AppError('Failed to fetch profile data'))
    }
}


// export these module so routes file can use 
export {
    register,
    login,
    logout,
    getProfile
};