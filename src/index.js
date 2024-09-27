import dotenv from 'dotenv';
import app from './app.js';
import connectDb from './db/index.js';

dotenv.config({
    path:'./.env'
})

connectDb()
.then(
    ()=>{
        try {
            app.on("error",(error)=>{
                console.log("Error:",error);
                process.exit(1);
            });

            app.listen(process.env.PORT, ()=>{
                console.log("App is running on port",process.env.PORT);
            })
        } catch (error) {
            console.log("Mongo DB connection failed", error);
        }
    }
)