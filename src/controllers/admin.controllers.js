import { categoryModel } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getCategory=async(req, res, next)=>{
    try {
        try {
            const categories=await categoryModel.find();
            if(!categories){
                throw new ApiError(500, "Something went wrong while retrieving categories");
            }

            return res 
                .status(200)
                .json(
                    new ApiResponse(200, categories, "Categories Fetched Successfully")
                )
        } catch (error) {
            if(error.message==="Something went wrong while retrieving categories"){
                return res 
                    .status(500)
                    .json({

                    })
            }
        }
    } catch (error) {
        next(error);
    }
}

const createCategory= async(req,res)=>{
    try {
        const {name}=req.body;
        
        const existingCategory= await categoryModel.findOne({name});

        if(existingCategory){
            throw new ApiError(409, "Category Already exist");
        }

        const category=await categoryModel.create({
            name,
        });

        const createdCategory=await categoryModel.findById(category._id);

        if(!createdCategory){
            throw new ApiError(500, "Something went wrong while creating Category")
        }
        
        return res
            .status(200)
            .json(
                new ApiResponse(200, createdCategory, "Category Created Sucessfully")
            )
    } catch (error) {
        if(error.message==="Category Already exist"){
            return res
                .status(409)
                .json({
                    code:409,
                    status:false,
                    message:"Category Already exist"
                })
        }

        else if(error.message==="Something went wrong while creating Category"){
            return res
                .status(500)
                .json({
                    code:500,
                    status:false,
                    message:"Something went wrong while creating Category"
                })
        }
    }
    
}

const deleteCategory=async(req, res)=>{
    const categoryId=req.params.id;

    try {
        const category = await categoryModel.findByIdAndDelete(categoryId);
        if(!category){
            throw new ApiError(404, "Category Not Found")
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "Category Deleted Successfully"))
    } catch (error) {
        if(error.message==="Category Not Found"){
            return res
                .status(404)
                .json({
                    statusCode:404,
                    status:false,
                    message:"Category Not Found"
                })
        }
        else{
            return res
                .status(500)
                .json({
                    statusCode:500,
                    status:false,
                    message:"Error while deleting the category"
                })
        }
    }
    
};

const updateCategory=async(req,res,next)=>{
    try {
        const categoryId=req.params.id;
        const updates=req.body;
        try {
            const category=await categoryModel.findByIdAndUpdate(categoryId, updates, {new:true});
            if(!category){
                throw new ApiError(404, "Category not Found")
            }

            return res
                .status(200)
                .json(new ApiResponse(200, category, "Category Update Successfully"))
        } catch (error) {
            if(error.message=="Category not Found"){
                return res
                    .status(404)
                    .json({
                        statusCode:404,
                        status:false,
                        message:"Category Not Found"
                    })
            }
            else{
                return res 
                    .status(500)
                    .json({
                        statusCode:500,
                        status:false,
                        message:"Error in Updating Category"
                    })
            }
        }
    } catch (error) {
        next(error)
    }
}
export {
    createCategory,
    deleteCategory,
    updateCategory,
    getCategory,
}