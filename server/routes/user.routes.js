//import express to make route
import express from 'express'
import {register,login,logout,getProfile, forgotPassword, resetPassword} from '../controllers/user.controller.js';
import isLoggedIn from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';



//makes a instance of router
const routes=express.Router();

//define routes for user
routes.post('/register',upload.single('avatar'),register);  //first go to avtar file and take data from avtar
routes.post('/login',login);
routes.get('/logout',logout);
routes.get('/me',isLoggedIn,getProfile);  //first we check user loggin or not then collect all data through cookie and then provide the profile data
routes.post('/forgotPassword',forgotPassword);
routes.post('/resetPassword',resetPassword);


export default routes;