//import express to make route
import express from 'express'
import register from '../controllers/user.controller.js';
import login from '../controllers/user.controller.js'


//makes a instance of router
const routes=express.Router();

//define routes for user
routes.post('/register',register);
routes.post('/login',login);
// routes.get('/logout',logout);
// routes.get('/me',getProfile);




export default routes;