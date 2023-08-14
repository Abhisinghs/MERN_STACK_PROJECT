//import the express module and neccessary modules
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


//make instance of express 
const app = express()

//we get the data as json format 
app.use(express.json())
app.use(cors({
    origin:[process.env.FRONTEND_URL],  //use orgin becuase other hosted website can use this api 
    credentials:true  //cookie can navigate form one place to another
}))
app.use(cookieParser())  //cookie can parse and get only neccassary info 

//when someone ping to server 
app.use('/ping',(req,res)=>{
    res.send("<h1>/PONG</h1>")
})


//define routes for module 

// if user hit the undefined url (NOT Defined URL) so send the error 
app.all('*',(req,res)=>{
    res.status(404).json('OOPS Page Not Found!')
})


//export the module so other file can use it 
export default app;