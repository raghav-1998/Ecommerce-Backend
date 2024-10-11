import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String
    },
    mobileOTP:{
        otp:String,
        isVerified:{type:Boolean, default:false},
        expiration:Date,
    },
    loginAttempts:{
        type:[
            {
                date:{type:Date},
                status:{type:String, enum:["Success", "Failure"]},
                method:{type:String, enum:["Password", "Mobile OTP"]},
            }
        ],
        default:[]
    }
},{timestamps:true, autoIndex:true});

//Hash the password before saving if there is any modification
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10);
    next();
})

//Custom method for checking password
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        name:this.name,
        email:this.email
    }, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User=mongoose.model("User",userSchema);