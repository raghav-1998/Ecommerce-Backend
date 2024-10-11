import jwt from "jsonwebtoken";
export const verifyJwt=async(req,res,next)=>{
    try {
        try {
            console.log(req.header("Authorization"));
            const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","");
            console.log(token);

            if(!token){
                throw new Error("Unauthorized Request")
            }

            const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
            console.log(decodedToken);
            
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        next(error)
    }
}