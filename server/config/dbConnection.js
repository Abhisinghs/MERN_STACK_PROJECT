//we connect the database 
import mongoose from "mongoose"

//define function to connect with DB 
const connectDb= async()=>{
    mongoose
    .connect(process.env.MONGO_URL)  //it reurns promise so we use then and catch
    .then((con)=>{
        console.log(`Database connected successfully with ${con.connection.host}`);
    })
    .catch((err)=>{
        console.log(`Error occurr while connecting to DB ${err.message}`);
    })
}