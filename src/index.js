import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({

})

connectDB().
then(()=>{
    app.on("error",(error)=>{
        console.log("Following error occurred: ",error);
        throw error;    
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is listening on port: ${process.env.PORT}`);        
    })
}).
catch((error)=>{
    console.log("MONGODB connection failed: ",error);
    process.exit(1);//#    
})

