import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken=async(userId)=>{
    try {
            if(!userId){
                throw new ApiError(400, "User Id is required for generating token");
            }
            const user = await User.findById(userId);
            const accessToken=user.generateAccessToken();
            const refreshToken=user.generateRefreshToken();

            user.refreshToken=refreshToken;
            await user.save({validateBeforeSave:false});

            return {accessToken,refreshToken};
        
    } catch (error) {
        if(error.message=="User Id is required for generating token"){
            throw new ApiError(400, "User Id is required for generating token");
        }
        throw new ApiError(500, "Internal Server Error. Failed to generate token");
    }    
}
const registerUser=async(req,res,next)=>{
    try {
            try {
                console.log(req.body);
            
                const {name, email, phone, password}=req.body;
    
                if([name, email, phone, password].some((field)=>field.trim()==="")){
                    throw new ApiError(400, "All field are required");
                }
                const phoneRegex=/^\d{10}$/;
                if(!phoneRegex.test(phone)){
                    throw new ApiError(400, "Phone Number Must be of 10 digits");
                }
    
                const existingUserByPhone=await User.findOne({phone});
                if(existingUserByPhone){
                    throw new ApiError(409, "User with this phone number already exist")
                }
                const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if(!emailRegex.test(email)){
                    throw new ApiError(400, "Invalid Email Id");
                }
    
                const lowerCaseEmail=email.toLowerCase();
                const existingUserByEmail=await User.findOne({email:lowerCaseEmail})
                if(existingUserByEmail){
                    console.log("Found user with already exist email Id");
                    throw new ApiError(409, "User with email Id already exist");
                }
    
                const user= await User.create({
                    name,
                    email,
                    phone,
                    password
                });
    
                const createdUser = await User.findById(user._id).select("-password");
                if(! createdUser){
                    throw new ApiError(500, "Something went wrong while registering user")
                }
    
                return res
                    .status(200)
                    .json(
                        new ApiResponse(200, createdUser, "User created successfully")
                    )
            } catch (error){
                console.log(error.message);
                console.log(error.code);
                if(error.message==="All field are required"){
                    return res
                        .status(400)
                        .json({
                            code:400,
                            status:false,
                            message:"All field are required"
                        })
                    //throw new ApiError(400, "All field are required");
                }
                else if(error.message==="User with this email Id already exist"){
                    return res
                        .status(409)
                        .json({
                            code:409,
                            status:false,
                            message:"User with this email Id already exist"
                        })
                    //throw new ApiError(409, "User with this email Id already exist");
                }
                else if(error.message==="User with this phone number already exist"){
                    return res
                        .status(409)
                        .json({
                            code:409,
                            status:false,
                            message:"User with this phone number already exist"
                        })
                    //throw new ApiError(409, "User with this phone number already exist");
                }
                else{
                    return res
                        .status(500)
                        .json({
                            code:500,
                            status:false,
                            message:"An error occurred while registering user"
                        })
                    //throw new ApiError(500, "An error occurred while processing your request");
                }
            }
        
    } catch (error) {
        next(error);
    }
};

const loginUserByPassword=async(req,res,next)=>{
    try {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({email});
            if(!user){
                throw new ApiError(404, "User not found")
            }
            const isPasswordValid= await user.isPasswordCorrect(password);
            if(isPasswordValid){
                const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id);
                user.loginAttempts.unshift({
                    date:Date.now(),
                    status:"Success",
                    method:"Password"
                });
                await user.save();

                const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

                const options={
                    httpOnly:true,
                    secure:true
                }

                return res
                    .status(200)
                    .cookie("accessToken",accessToken,options)
                    .cookie("refreshToken",refreshToken,options)
                    .json(
                        new ApiResponse(200, {user:loggedInUser, accessToken, refreshToken}, "User Logged In Successfully")
                    );
            }
            // if(!isPasswordValid){
            //     throw new  ApiError(401, "Invalid User Credentials");
            // }
 
            user.loginAttempts.unshift({
                date:Date.now(),
                status:"Failure",
                method:"Password"
            })

            await user.save();

            throw new ApiError(401, "Invalid User Credentials")

        } catch (error) {
            console.log("Error:",error);
            if(error.message ==="User not found"){
                return res
                    .status(404)
                    .json({
                        code:404,
                        status:false,
                        message:"User Not Found"
                    })
            }
            else if(error.message === "Invalid User Credentials"){
                return res
                    .status(401)
                    .json({
                        code:401,
                        status:false,
                        message:"Invalid User Credentials",
                    })
            }
            else{
                return res
                    .status(500)
                    .json({
                        code:500,
                        status:false,
                        message:"Error occur while login with password"
                    })
            }
            //throw new ApiError(500,"Internal Server Error")
        }
    } catch (error) {
        next(error);
    }
};

// const mobileOTPLogin= async(req,res,next)=>{
//     try {
//         try {
//             const {phone} = req.body;
//             const user = await User.findOne({phone});
//             if(!user){
//                 throw new ApiError(404, "User not Found")
//             }

//             sendOtp(phone)
//         } catch (error) {
//             if(error.message==="User not Found"){
//                 throw new ApiError(404, "User not Found")
//             }
//         }
    
//     } catch (error) {
//         next(error)
//     }    
// };
export {
    registerUser,
    loginUserByPassword,
    //mobileOTPLogin,
};