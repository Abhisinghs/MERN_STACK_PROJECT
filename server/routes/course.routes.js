//import the router module 
import {Router} from 'express'
import { createCourse, getAllCourses, getLectueByCourseId, removeCourse, updateCourse } from '../controllers/course.controller.js';
import isLoggedIn, { atuhorisedRoles } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';


//make instace of router 
const routes = Router();


//set the routes 
//for list all the course 
routes.route('/').get(getAllCourses).post(isLoggedIn,atuhorisedRoles('ADMIN'),upload.single('thumbnail'),createCourse);   //why we do routes.route('/') becuase we can  send two request get and post at same url 
  
//for list the course by id 
routes.route('/:id').get(isLoggedIn,getLectueByCourseId).put(isLoggedIn,atuhorisedRoles('ADMIN'),updateCourse).delete(isLoggedIn,atuhorisedRoles('ADMIN'),removeCourse);  //why we add update and delete because we need a which course we will update or delete

export default routes;