import mongoose from "mongoose";

const subCategorySchema=mongoose.Schema({
    subCategoryName:{
        type:String,
        required:true,
        index:true
    },
    categoryId:{
        type:mongoose.Schema.ObjectId,
        ref:"Category",
    },
    parentId:{
        type:mongoose.Schema.ObjectId,
        ref:"SubCategory"
    },
},{timestamps:true});

export const subCategoryModel=mongoose.model("SubCategory",subCategorySchema);