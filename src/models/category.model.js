import mongoose from "mongoose"
const categorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true
    }
},{timestamps:true})

export const categoryModel=mongoose.model("Category", categorySchema);
