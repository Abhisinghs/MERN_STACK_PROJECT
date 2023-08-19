//import mongoose 
import {Schema, model} from 'mongoose'

// define a course schema 
const courseSchema= new Schema({
    title:{
        type:String,
        required:[true,''],
        minlength:[8,'title must be atleast 8 char'],
        maxlength:[50,'title lengh should be less than 50'],
        trim:true  //add validation if any error occur it tells
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
        public_id:{
            type:String,
            required:true
        },
        secure_url:{
            type:String,
            required:true
        }
    },
    lectures:[{
        title:String,
        description:String,
       lecture:{
            public_id:{
                type:String,
                required:true
            },
            secure_url:{
                type:String,
                required:true
            }
        }
    }],
    numberOfLecture:{
        type:Number,
        default:0
    },
    createdBy:{
        type:String,
        required:[true,'please mention the name of course creater']
    }
},
    {   //it stores the course detail with proper timestamps 
        timestamps:true
    }
)

// make model instance 
const courseModel= model('courseData',courseSchema);


// export the course model 
export default courseModel;