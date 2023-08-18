//import mongoose 
import {Schema, model} from 'mongoose'

const courseSchema= new Schema({
    title:{
        type:String,
        required:[true,''],
        minlength:[8,'title must be atleast 8 char'],
        maxlength:[50,'title lengh should be less than 50'],
        trim:true
    },
    description:{
        type:String,
        rrequired:[true,'description is required'],
        minlength:[8,'description must be atleast 8 char'],
        maxlength:[200,'description lengh should be less than 200'],
        trim:true
    },
    category:{
        type:String,
        required:[true,'category is required']
    },
    thumbnail:{
        pulic_id:{
            type:String,
            required:true
        },
        secure_url:{
            type:String,
            required:true
        }
    },
    lecture:{
        title:String,
        description:String,
        public_id:{
            type:String,
            required:true
        },
        secure_url:{
            type:String,
            required:true
        }

    },
    numberOfLecture:{
        type:Number,
        default:0
    },
    createdBy:{
        type:String,
        required:[true,'please mention the name of course creater']
    }
},
    {
        timestamps:true
    }
)

// make model instance 
const courseModel= model('courseData',courseSchema);

export default courseModel;