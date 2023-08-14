//import the app to run the port 
import app from './app.js'

// define hostname and PORT 
const hostname ='localhost'
const PORT = process.env.PORT || 8000


// listen service to run the server  
app.listen(PORT,()=>{
    console.log(`server is running at http://${hostname}:${PORT}`);
})