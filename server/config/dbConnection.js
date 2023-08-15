//we connect the database 
import mongoose from "mongoose";

// it means make our db ease 
mongoose.set('strictQuery',false); //whenever user make query with db and data is not present so dont give error (strictQuery->false)


//define function to connect with DB 
const connectDb= async()=>{
    mongoose
    .connect(process.env.MONGO_URL)  //it reutrns promise so we use then and catch
    .then((con)=>{
        console.log(`Database connected successfully with ${con.connection.host}`);
    })
    .catch((err)=>{
        console.log(`Error occurr while connecting to DB ${err.message}`);
        process.exit(1);  //destroy everything because if db will not connected so why we need to run server 
    })
}


// export the module 
export default connectDb;