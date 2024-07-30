const User = require("../models/User");
const jwt=require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isAuthenticated = require("../middlewares/isAuthenticated");
require("dotenv").config();
exports.register = async (req, res) => {
    try {
        const { name, email, password} = req.body;
        if (!name || !email || !password) {
            return res.status(200).json({
                success: false,
                message: "Provide all the details"
            });
        }

        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.status(500).json({
                success: false,
                message: "User already exists",
            });
        }

        let hashPassword;
        try {
            hashPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(400).json({
                message: "Cannot hash password",
            });
        }

        // const trialExpiresDate = new Date(new Date().getTime() + trialPeriod * 24 * 60 * 60 * 1000);
        // if (isNaN(trialExpiresDate.getTime())) {
        //     return res.status(400).json({
        //         message: "Invalid trial expiration date",
        //     });
        // }

        const newUser = new User({
            name,
            email,
            password: hashPassword,

        });
        newUser.trialExpires = new Date(new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000);
     
        await newUser.save();

        return res.status(200).json({
            success: true,
            message: "User created successfully",
            user: {
                name,
                email,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Unexpected error",
        });
    }
};
exports.login=async( req,res)=>{
    try{
const {email,password}=req.body;
if(!email || !password){
    return res.json({
        message:"Please Provide all details",
        success:true,
    })
}
const user=await User.findOne({email});
if(!user){
    return res.json({
        message:"User does not Exists",
        success:false,
    })
}

    if(await bcrypt.compare(password,user.password)){
        const payload={
            email:user.email,
            id:user._id,
        };
        const token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"24h",
        });
        const options = {
            httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
        };
        return res.cookie("token",token,options).json({
            success:true,
            message:"User logged in usuccessfully",
            user,
        })
    }
   else{
    return res.status(400).json({
        success: false,
        message: "Passowrd incorret"
    });
   }



    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during login"
        });
    }
}
exports.logout=async(req,res)=>{
    try{ 
       res.cookie("token","",{
            maxAge:1,
            
        });
        res.status(200).json({
            message:"User logged out sucessfully"
        })
       

    }catch(error){
return res.status(500).json({
    success:true,
    message:"Erro occured",
})
    }
};
exports.checkAuthenticated=async (req,res)=>{
    const decoded=jwt.verify(req.cookies.token,process.env.JWT_SECRET);
    
    try{
        if(decoded){
            res.json({
                isAuthenticated:true,
            })
        }else{
            res.json({
                isAuthenticated:false,
            })
        }
    }catch(error){
console.log(error);
return res.status(404).json({
    success:false,
    message:"Unexpected Error"
})
    }
   

}
exports.profile=async (req,res)=>{
    try{

const user=await User.findById(req?.user?.id).select("-password").populate('payments').populate("history");
if(user){
    return res.status(200).json({
        success:true,
        message:"User Fetched Successfully",
        user,
    });
}else{
    return res.status(400).json({
        success:false,
        message:"User does not exits",
    })
}
    }catch(error){
        console.log(error);
return res.status(500).json({
    success:false,
    message:"Unexpected Error",
  
})
    }
}

