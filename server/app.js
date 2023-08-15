// import dotenv file 
import 'dotenv/config'
//import the express module and neccessary modules
import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import UserRoutes from './routes/user.routes.js'
import errorMiddleware from './middleware/error.middleware.js'


//make instance of express 
const app = express()

//some middle ware 
//we get the data as json format 
app.use(express.json())
app.use(cors({
    origin:[process.env.FRONTEND_URL],  //use orgin becuase other hosted website can use this api 
    credentials:true  //cookie can navigate form one place to another
}))
app.use(cookieParser())  //cookie can parse and get only neccassary info 
app.use(morgan('dev'));  //it is a logger middle ware that log the message in console 
app.use(urlencoded({extended:true}))


//when someone ping to server 
app.use('/ping',(req,res)=>{
    res.send("<h1>/PONG</h1>")
})


//define routes for module 

// routes for user query 
app.use('/api/v1/user',UserRoutes)

// if user hit the undefined url (NOT Defined URL) so send the error url -> routes 
app.all('*',(req,res)=>{
    res.status(404).json('OOPS Page Not Found!')
})

// generic error handling (error middle ware)
app.use(errorMiddleware);  // now go to errorMiddleware in middleware file 


//export the module so other file can use it 
export default app;