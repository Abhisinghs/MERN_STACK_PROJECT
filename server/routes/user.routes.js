//import express to make route
import express from 'express'

//makes a instance of router
const routes=express.Router();

//define routes 
routes.post('/register',register);
routes.post('/login',login);
routes.get('/logout',logout);
routes.get('/me',getProfile);



export default routes;