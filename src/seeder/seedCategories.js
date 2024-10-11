import dotenv from 'dotenv';
import mongoose from "mongoose";
import connectDb from "../db/index.js";
import * as fs from "node:fs";
import { categoryModel } from "../models/category.model.js";

dotenv.config({
  path:'./.env'
})

const seedCategoriesFromJson=async()=>{
    const categoriesData=JSON.parse(fs.readFileSync("src/seeder/categories.json","utf-8"));

    for(const category of categoriesData){
        const newCatgory= new categoryModel({
            name:category.name
        });

        await newCatgory.save();
    }
}

const disconnectDB=async()=>{
    await mongoose.disconnect();
}

(async () => {
    try {
      await connectDb();
      // await updateCinFromExcel();
      // await updateUserFromJson();
      await seedCategoriesFromJson();
    } catch (err) {
      console.error('Error:', err);
    } finally {
      await disconnectDB();
    }
  })();

