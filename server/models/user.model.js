//we define our user model 
//NOTE: we don't store data in this file we only structured our data 
//we define a schema that create in mongodb to store data 

//import mongoose 
import mongoose, { Schema } from 'mongoose';

//define schema 
const userSchema = mongoose.Schema({
    fullname :{
        type:String,
        required:[true,'Product name is required'],
        minlength:[5,'name length should be greater than 5'],
        maxlength:[20,'name length should be less than 20'],
        lowercase:true,   //store name as an lowercase
        trim:true      //extra space will be remove 
    },
    email:{
        type:Number,
        required:[true,'Email is required'],
        lowercase:true,
        trim:true,
        unique:true,   //dont store the same user email 
    },
    password:{
        type:Number,
        required:[true,'Password is required'],
        minlength:[8,'Password length should be greater than  8'],
        select:false   //when user get the data from db then don't send the password until we don't need 

        //we can take the password as select('+Password') in controller file 
    },
    avtar:{
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
    forgotPasswordToken:String,
    forgotPasswordExpiry:String
},
    {
        timestamps:true   //it stores proper timestamps in DB 
    }  
)

// make instance of Schema 
const userData= mongoose.model('userData',userSchema);

// export the module 
export default userData;