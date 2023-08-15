//import the app to run the port 
import app from './app.js';
import connectDb from './config/dbConnection.js';
import cloudinary from 'cloudinary'

// define hostname and PORT 
const hostname ='localhost';
const PORT = process.env.PORT || 8000;


//cloudinary configuration
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})
// listen service to run the server  
app.listen(PORT,async()=>{
    //connect with DB
    await connectDb();
    console.log(`server is running at http://${hostname}:${PORT}`);
})