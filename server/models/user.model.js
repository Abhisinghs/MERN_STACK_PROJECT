//we define our user model 
//NOTE: we don't store data in this file we only structured our data 
//we define a schema that create in mongodb to store data 

//import mongoose 
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import crypto from 'crypto'

//define schema 
const userSchema = mongoose.Schema({
    fullName :{
        type:String,
        required:[true,'Product name is required'],
        minlength:[5,'name length should be greater than 5'],
        maxlength:[20,'name length should be less than 20'],
        lowercase:true,   //store name as an lowercase
        trim:true      //extra space will be remove 
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        lowercase:true,
        trim:true,
        unique:true,   //dont store the same user email 
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill in a valid email address',
        ]
    },
    password:{
        type:Number,
        required:[true,'Password is required'],
        minlength:[8,'Password length should be greater than  8'],
        select:false   //when user get the data from db then don't send the password until we don't need 

        //we can take the password as select('+Password') in controller file 
    },
    avatar:{
        public_id:{
            type:String
        },
        secure_url:{
            type:String
        }
    },
    role:{                 //It tell us person is user or admin because we use same api for both (How it is possible ->it is possible because we will use the authorisation mechanism )
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription: {
        id: String,
        status: String
    }

},
    {
        timestamps:true   //it stores proper timestamps in DB 
    }  
)


//define pre hook to encrypt the password 
userSchema.pre('save',async function(next){
    //if no change in password 
    if(!this.isModified('password')){
        return next();
    }
this.hello="hgjhhjhh"
    // if change then encrypt 
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password.toString(),salt);  //my password in random 10 char generate 
    return next()
})

//define method to generate token 
userSchema.methods={
    generateJWTToken:async function(){
        return await JWT.sign(
            { id:this._id,email:this.email,subscription:this.subscription,role:this.role},
            process.env.JWT_SECRET ||"abc",
            {
                expiresIn:process.env.JWT_EXPIRY||"1h",
            }
        )
    },
    comparePassword: async function(plainTextPassword){  //compare encrypted password 
        return  await bcrypt.compare(plainTextPassword.toString(),this.password.toString())
    },
    generatePasswordResetToken :async function(){
        const resetToken = crypto.randomBytes(20).toString('hex');

    
        this.forgotPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')
        ;
        this.forgotPasswordExpiry = Date.now() + 15 * 60*1000; //15min from now 

        return resetToken;
    }
}

// make instance of Schema 
const userData= mongoose.model('userData',userSchema);

// export the module 
export default userData;

