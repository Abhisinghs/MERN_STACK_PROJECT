//import the router module 
import {Router} from 'express'
import {addLectureByCourseId, createCourse, deleteLecture, getAllCourses, getLectueByCourseId, removeCourse, updateCourse } from '../controllers/course.controller.js';
import upload from '../middleware/multer.middleware.js';
import { atuhorisedRoles, isLoggedIn } from '../middleware/auth.middleware.js';


//make instace of router 
const routes = Router();


//set the routes 
//for list all the course 
routes.route('/').get(getAllCourses)
.post(isLoggedIn,atuhorisedRoles('ADMIN'),upload.single('thumbnail'),createCourse);   //why we do routes.route('/') becuase we can  send two request get and post at same url 
  
//for list the course by id 
routes.route('/:id').get(isLoggedIn,getLectueByCourseId)
.put(isLoggedIn,atuhorisedRoles('ADMIN'),updateCourse)
.delete(isLoggedIn,atuhorisedRoles('ADMIN'),removeCourse)
.post(isLoggedIn,atuhorisedRoles('ADMIN'),upload.single('lecture'),addLectureByCourseId);  //why we add update and delete because we need a which course we will update or delete

//routs for delete lecture 
routes.delete('/deleteLecture/:id',deleteLecture);

export default routes;