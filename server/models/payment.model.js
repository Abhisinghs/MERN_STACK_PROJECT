//define schema for payment 

//import mongoose 
import {model,Schema} from 'mongoose'

//define schema 
const paymentSchema = new Schema({
    razorpay_payment_id:{
        type:String,
        required:true
    },
    razorpay_subscription_id:{
        type:String,
        required:true
    },
    razorpay_singnature:{
        type:String,
        required:true
    }
},
   {
    timestamps:true
   }
)

//make model
const payment= model('payment',paymentSchema);

//export module
export default payment;