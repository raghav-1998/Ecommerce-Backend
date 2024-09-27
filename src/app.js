import express from "express";
import cors from "cors";

const app=express();
var corsOption={
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}

app.use(cors(corsOption));
app.use(express.json());

//import routers
// import userRouter from "./routes/user.routes.js";

// //app.use('/user',userRouter)
// app.use('/api/v1/user',userRouter)   //Standard Industry Practice
export default app;