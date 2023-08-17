//Here we cover only logic part 
// In this controller file we only make function or module and use in routers file 
//import module form different file 
import 'dotenv/config'
import userData from '../models/user.model.js'
import AppError from '../utils/error.util.js'
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto'

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
            avatar:{
                public_id:'http',
                secure_url:'demo url'
            }
        })
        
        // if data dosen't store in Db
        if(!User){
            return next(new AppError('user registration failed,Please try!',404));
        }


        // 2.step 
        //TODO: file upload (we upload the file on third party app so our data can safe )
        if(!req.file){
            return res.status(400).json('please upload  a file')
        }

        if(req.file){
            try{
                const result =  await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms',
                    width:250,
                    height:250,
                    gravity:'faces',
                    crop:'fill'
                })

                if(result){
                    User.avatar.public_id=result.public_id;
                    User.avatar.secure_url=result.secure_url;

                    //remove file from server 
                    fs.rm(`uploads/${req.file.filename}`)
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
        const user=await userData.findOne({
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
        return next(new AppError(err.message,500));
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

//forgotpassword logic
const forgotPassword = async(req, res,next)=>{
    //get email from body
    const {email}=req.body;

    //if email is present on body or not 
    if(!email){
        return next(new AppError('Email is required',400));
    }

    //email is present on database or not 
    const user = await userData.findOne({email});
    if(!user){
        return next(new AppError('Email not registered',400));
    }

    //generate token 
    const resetToken = await user.generatePasswordResetToken();

    //store token in database before sending to user 
    await user.save();

    const resetPasswordURL= `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

    // resetPasswordURL 
    console.log(resetPasswordURL);

    const subject='Reset Password';

    const message = `You can reset your password by clicking <a href=${resetPasswordURL} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordURL}.\n If you have not requested this, kindly ignore.`;

    //send url of user email
    try{

        //send detail to email method that send email to user
        await sendEmail(email,subject,message);

        res.status(200).json({
            success:true,
            message:`Reset password token has been sent to ${email} successfully`
        })
    }catch(e){
        //if any error occur so we reset the password token and expiry than we can use again no need to create new variable 
        user.forgotPasswordExpiry=undefined;
        user.forgotPasswordToken=undefined;

        // await user.save();
        return next(new AppError(e.message,500))
    }
}

//reset password logic (in this case user don't know the password)
const resetPassword = async(req,res)=>{
    try{
        //take token info from params
        const {resetToken}= req.params;
        const {password}=req.body;

        const forgotPasswordToken=crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')

        const user = await userData.findOne({
            forgotPasswordToken,
            forgotPasswordExpiry:{$gt:Date.now()}
            
        });
        if(!user){
            return next(
                new AppError('Token is invalid or expired, please try again',400)
            )
        }


        user.password=password;
        user.forgotPasswordToken=undefined
        user.forgotPasswordExpiry=undefined

        user.save();

        res.status(200).json({
            success:true,
            message:'Password changed successfully'
        })
    }catch(e){
        res.status(400).json({
            success:false,
            message:`erro occur while reset password${e.message}`
        })
    }

}

//logic for change password (in this case user know the password )
const changePassword = async(req,res)=>{
    const {oldPassword,newPassword}=req.body;
    const {id}=user.id;

    if(!oldPassword||newPassword){
        return next(new AppError('All field are madatory',400));
    }

    const user=await userData.findById(id).select('+password');

    if(!user){
        return next(new AppError('user does not exists!',400))
    }

    const isPasswordValid=await user.comparePassword(oldPassword);

    if(!isPasswordValid){
        return next(new AppError('Invalid old password',400))
    }

    user.password=newPassword;

    await user.save();

    user.password=undefined;

    res.status(200).json({
        success:true,
        message:'Password changed successfully!'
    })
}

//update profile
const updateUser=async(req,res)=>{
    const{fullName}=req.body;
    const{id}=req.userData.id;

    const user=await userData.findById(id);

    if(!user){
        return next(new AppError('User does not exist',400))
    }

    if(req.fullName){
        user.fullName=fullName;
    }

    if(req.file){
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        try{
            const result =  await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                width:250,
                height:250,
                gravity:'faces',
                crop:'fill'
            })

            if(result){
                user.avatar.public_id=result.public_id;
                user.avatar.secure_url=result.secure_url;

                //remove file from server 
                fs.rm(`uploads/${req.file.filename}`)
            }
        }catch(e){
            return next(
                new AppError(e.message||'File not uploaded, please try again',500)
            )
        }
    }

    await user.save();
    res.status(200).json({
        success:true,
        message:`User details updated successfully`
    })

}
// export these module so routes file can use 
export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
};