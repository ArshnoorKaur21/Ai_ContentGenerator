const User = require("../models/User");

const checkApiRequestLimit=async (req,res,next)=>{
    if(!req.user){
        return res.status(401).json({
            success:false,
            message:"Unauthorized",
        });
    }
    const user=await User.findById(req?.user?.id);
    if(!user){
        return res.status(404).json({
            message:"User not found",
        });
    }
    let requestLimit=0;
    if(user?.trialActive){
        requestLimit=user?.monthlyRequestCount;
    }
    if(user?.apiRequestCount>=requestLimit){
        return res.status(400).json({
            success:false,
            message:"APi Request Limit Reached"
        })
    }
    // console.log(req.user);
    next();

}
module.exports=checkApiRequestLimit;