import dotenv from 'dotenv';
import connectDb from "../db/index.js";
import mongoose from 'mongoose';
import xlsx from 'xlsx';
import { categoryModel } from '../models/category.model.js';
import { subCategoryModel } from '../models/subCategory.model.js';

dotenv.config({
    path:'./.env'
});

const seedSubCategoriesFromExcel=async ()=>{
    const workbook=xlsx.readFile('src/seeder/Subcategories.xlsx');
    const sheetName=workbook.SheetNames[0];
    const sheet=workbook.Sheets[sheetName];
    const data=xlsx.utils.sheet_to_json(sheet);
    // console.log(workbook);
    // console.log(sheetName)  
    // console.log(sheet);

    console.log(data.length)

    try {
      for(const subCategory of data){
        const category= await categoryModel.findOne({name:subCategory.Category});
        if(!category){
          console.log(`${subCategory.Category} Category not found`)
        }

        let parentSubcategoryId=null;
        if(subCategory.ParentSubcategory){
          const parentSubcategory=await subCategoryModel.findOne({subCategoryName:subCategory.ParentSubcategory});
          if(parentSubcategory){
            parentSubcategoryId=parentSubcategory._id;
          }
          else{
            console.log(`${subCategory.ParentSubcategory} Subcategory not found`)
          }
        }

        const newSubCategory=new subCategoryModel({
          subCategoryName:subCategory.Name,
          categoryId:category._id,
          parentId:parentSubcategoryId
        });

        console.log(newSubCategory)
        await newSubCategory.save();
      }
    } catch (error) {
      
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
    await seedSubCategoriesFromExcel();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await disconnectDB();
  }
})();
