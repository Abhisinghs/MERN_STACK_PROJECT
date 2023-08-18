//import the course model first
import courseModel from '../models/course.model.js'
import AppError from '../utils/error.util.js'
import fs from 'fs/promises'
import cloudinary from 'cloudinary'

//define logic of course 

//create course 
const createCourse = async function(req,res,next){
    //data comes in form data (multipart form data and we provide picture in thumbnail )

    //get data from form data
    const {title,description,category,createdBy}=req.body;

    try{
        //if all field is empty
        if(!title || !description || !category || !createdBy){
            return next(
                new AppError('All fields are required ',400)
            )
        }

        //make a instance of course store course in database
        const course= await courseModel.create({
            title,
            description,
            category,
            createdBy,
            thumbnail:{
                public_id:'dummy',
              
                secure_url:'http://sdkfjdkfj'
            },
        })

        console.log(course);
        //if course store or not
        if(!course){
            return next(
                new AppError('Course could not created, please try again',500)
            )
        }


        console.log('object',req.file);
        if(req.file){

            try{
            
                const result= await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms'
                });
        
                if(result){
                    course.thumbnail.public_id=result.public_id;
                    course.thumbnail.secure_url=result.secure_url
                }
        
                //delete from server no need because we already stored at cloud
                fs.rm(`uploads/${req.file.filename}`);

            }catch(e){
                return next(
                    new AppError('picture upload failed please try again',500)
                )
            }
        }


        await  course.save();

        res.status(200).json({
            success:true,
            message:'Course created successfully',
            course
        })

    }catch(e){
        return next(
            new AppError('course creation unsuccessful!',500)
        )
    }
}

//get all course 
const getAllCourses = async(req,res,next)=>{

   try{
    //we only need course details not the lecture thats why we don't select lectures
    const courses=await courseModel.find({}).select('-lectures')

    if(!courses){
        return next(new AppError('courses are empty please try again!',400))
    }

    //return the resopnse
    res.status(200).json({
        success:true,
        message:'All courses',
        courses
    })
   }catch(e){
    return next(
        new AppError(e.message,500)
        )
   }

}

//get lecture of course 
const getLectueByCourseId=async(req,res,next)=>{
    try{
        //take the course id to get the lecture 
        const {id}=req.params;

        //select lecture from database by course id 
        const course=await courseModel.findById(id);

        console.log(course);
        //if lecture not present 
        if(!course){
            return next(new AppError('Invalid course id',400))
        }

        //send a confirmation message
        res.status(200).json({
            success:true,
            message:'Course lectures fetched successfully',
            lectures:course
        })
    }catch(e){
        return next(
            new AppError(e.message,500)
        )
    }
}

//update course logic
const updateCourse = async(req,res,next)=>{
    //get request which course update 
    const {id}=req.params

  try{
        //find course from database 
        const course = await courseModel.findByIdAndUpdate(
            id,  //which course you would be update 
            {
                $set:req.body    //whatever user pass name, title, description ,image overwrite from previous 
            },
            {
                runValidators:true    //on runtime check the given data is correct or not as our model define 
            }
        )

        // if course not present in Db
        if(!course){
            return next(
                new AppError('course with given id does not exists',500)
            )
        }

        const courseData=course;
        //send confirmation msg
        res.status(200).json({
            success:true,
            message:'course updated successfully',
            courseData
        })
    }catch(e){
        return next(new AppError(e.message,500))
    }

}


//delete course 
const removeCourse=async(req,res,next)=>{
    const {id}=req.params

    try{
        //find course from database 
        const course = await courseModel.findByIdAndDelete(id) 

        // if course not present in Db
        if(!course){
            return next(
                new AppError('course with given id does not exists',500)
            )
        }

        const courseData=course;
        //send confirmation msg
        res.status(200).json({
            success:true,
            message:'course deleted  successfully',
            courseData
        })
    }catch(e){
        return next(new AppError(e.message,500))
    }

}


export {
    createCourse,
    getAllCourses,
    getLectueByCourseId,
    updateCourse,
    removeCourse
}