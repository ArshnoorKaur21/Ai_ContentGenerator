const User = require("../models/User");
const jwt=require("jsonwebtoken");

const isAuthenticated=async(req,res,next)=>{
    if(req.cookies.token){
const decoded=jwt.verify(req.cookies.token,process.env.JWT_SECRET);
// console.log("Decoded is",decoded);
req.user=await User.findById(decoded?.id).select("-password");
// console.log("Requested user i s",req.user);
return next();
    }
    else{
        return res.status(401).json({
            success:false,
            message:"Unauthorized",
        })
    }
}
module.exports=isAuthenticated;