import { app } from "../src/app.js";
import serverless from "serverless-http";
import connectDB from "../src/db/index.js";

// Connect once before handling requests
connectDB();
export default serverless(app);//new change for vercel
//export default app;// new changes for vercel 






// import connectDB from "./db/index.js";
// import dotenv from "dotenv";
// import { app } from "./app.js";

// dotenv.config({

// })

// connectDB().
// then(()=>{
//     app.on("error",(error)=>{
//         console.log("Following error occurred: ",error);
//         throw error;    
//     })
//     app.listen(process.env.PORT || 8000,()=>{
//         console.log(`Server is listening on port: ${process.env.PORT}`);        
//     })
// }).
// catch((error)=>{
//     console.log("MONGODB connection failed: ",error);
//     process.exit(1);//#    
// })

