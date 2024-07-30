const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cookieParser = require('cookie-parser');
const cron=require("node-cron");
app.use(bodyParser.json());
const db=require("./config/database");
const userRouter = require('./Routes/UserRoute');
const openAIRouter=require('./Routes/openAIRoutes');
const stripeRouter = require('./Routes/stripePayment');
const User = require('./models/User');
const cors = require("cors");
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin:"https://contentgentai.vercel.app",
    credentials: true,
}));
cron.schedule('0  0 *  * * *',async ()=>{
    console.log("This task run every second");
    try{
        const today=new Date();
await User.updateMany({
    trialActive:true,
    trialExpires:{$lt:today},
},{
    trialActive:false,  
    subscriptionPlan:"Free",
    monthlyRequestCount:5,
});
 
    }catch(error){
console.log(error);
    }
})
cron.schedule('0 0 1  * * *',async ()=>{
    console.log("This task run every second");
    try{
        const today=new Date();
await User.updateMany({
    subscriptionPlan:'Free',
   nextBillingDate:{$lt:today},
},{
 
    monthlyRequestCount:0,
});

    }catch(error){
console.log(error);
    }
})
cron.schedule('0 0 1  * * *',async ()=>{
    console.log("This task run every second");
    try{
        const today=new Date();
await User.updateMany({
    subscriptionPlan:'Basic',
    nextBillingDate:{$lt:today},
},{
 
    monthlyRequestCount:0,
});
// console.log(updatedUser);
    }catch(error){
console.log(error);
    }
})
cron.schedule('0 0 1  * * *',async ()=>{
    console.log("This task run every second");
    try{
        const today=new Date();
await User.updateMany({
    subscriptionPlan:'Premium',
    nextBillingDate:{$lt:today},
},{
 
    monthlyRequestCount:0,
});
// console.log(updatedUser);
    }catch(error){
console.log(error);
    }
})
db.connect();
app.use(cookieParser());
app.use('/api/v1',userRouter);
app.use('/api/v1',openAIRouter)
app.use('/api/v1',stripeRouter);
// app.post('/api/v1/cars',(req,res)=>{
//     const {name}=req.body;
//     console.log(name);
//     return res.status(200).json({
//         success:true,
//         message:"Post succeassfully",
//     })
// })

app.listen(PORT,(req,res)=>{
    console.log(`App is running at PORT ${PORT}`);
})
