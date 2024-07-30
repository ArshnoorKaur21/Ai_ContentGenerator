// const Razorpay = require("razorpay");
// const { instance } = require("../config/razorpay");
const stripe=require("stripe")(process.env.STRIPE_SECRET_KEY);
// console.log(process.env.STRIPE_SECRET_KEY)
const Payment = require("../models/Payment");
const User = require("../models/User");
const { calculateNextBillingDate } = require("../utils/calculateNextBillingDate");
const { shouldRenewSubscriptionPlan } = require("../utils/shouldRenewsubscription");

exports.handlestripePayment=async (req,res)=>{
    const {amount,subscriptionPlan}=req.body;
    const user=req?.user;
    console.log("User is",user);
    try{
       const paymentIntent= await stripe.paymentIntents.create({
            amount:Number(amount)*100,
            currency:"usd",
        
            metadata:{
                userId:user?._id?.toString(),
                userEmail:user?.email,
                subscriptionPlan,
            },
            
        });
        return res.status(200).json({
            clientSecret:paymentIntent?.client_secret,
            paymentId:paymentIntent?.id,
            metadata:paymentIntent?.metadata,
            success:true,
        });
        console.log("Payment intent",paymentIntent);

    }catch(error){
console.log(error);
return res.status(500).json({
    success:false,
    message:"Unexpected Error",
})
    }
}

// const crypto = require("crypto");
// exports.capturePayment = async (req, res) => {
//     const { amount, subscriptionPlan } = req.body;
//     const user = req.user;
//     console.log("User is ", user);

//     const currency = "INR";
//     const options = {
//         amount: amount * 100, 
//         currency,
//         receipt: `receipt_${Math.random().toString(36).substr(2, 9)}`,
//     };

//     try {
//         const paymentResponse = await instance.orders.create(options);
//         res.json({
//             success: true,
//             message: paymentResponse,
//         });
//     } catch (error) {
//         console.error("Error in payment capture: ", error);
//         return res.status(500).json({
//             success: false,
//             message: "Could not initiate order",
//             error: error.message,
//         });
//     }
// };
exports.handleFreeSubscription=async (req,res)=>{
    try{
        const user=req?.user;
        calculateNextBillingDate();
        console.log("Requester User is",user);
        try{
            if(shouldRenewSubscriptionPlan(user)){
                user.subscriptionPlan="Free",
                user.monthlyRequestCount=5;
                user.apiRequestCount=0;
                user.nextBillingDate=calculateNextBillingDate();
                const newPayment=await Payment.create({
                    user:user?._id,
                    subscriptionPlan:"Free",
                    amount:0,
                    status:"success",
                    reference:Math.random().toString(36).substring(7),
                    monthlyRequestCount:5,
                    currency:'inr'
                });
                user.payments.push(newPayment?._id);
                await user.save();
 
return res.status(200).json({
    success:true,
    message:"Subscription Plan Updated Successfully",
    user,
}
);
            }else{
                return res.status(403).json({
                    message:"Subscription Renewal nt due yet"
                });
            }
        }catch(error){
            console.log(error);
        }

    }catch(error){
        console.log(error);
return res.status(500).json({
    success:false,
    message:"Unexpected Error",
})
    }
}
// exports.verifyPayment = async (req, res) => {
//     const razorpay_order_id = req.body?.razorpay_order_id;
//     const razorpay_payment_id = req.body?.razorpay_payment_id;
//     const razorpay_signature = req.body?.razorpay_signature;
//     const userId = req.user.id; // Assuming you're using some middleware to get userId

//     if (!razorpay_order_id ||
//         !razorpay_payment_id ||
//         !razorpay_signature || !userId) {
//         return res.status(200).json({ success: false, message: "Payment Failed" });
//     }

//     let body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//         .createHmac("sha256", process.env.RAZORPAY_SECRET)
//         .update(body.toString())
//         .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//         return res.status(200).json({ success: false, message: "Payment Verification Failed" });
//     }

//     try {
//         // Fetch the payment details from the database (if needed)
//         // Example: const payment = await Payment.findOne({ reference: razorpay_payment_id });

//         // Simulate payment status (for example purposes)
//         const paymentStatus = 'success'; // This could be fetched from a payment gateway or database

//         if (paymentStatus !== 'success') {
//             return res.status(200).json({ success: false, message: "Payment Failed" });
//         }

//         // Create a new Payment document
//         const payment = new Payment({
//             user: userId,
//             reference: razorpay_payment_id,
//             currency: 'INR', // Adjust as per your requirements
//             status: 'completed', // Assuming payment verification is successful
//             subscriptionPlan: 'premium', // Example: You should set this based on your logic
//             amount: 1000, // Example: You should set this based on your logic
//             monthlyRequestCount: 500 // Example: You should set this based on your logic
//         });


//         await payment.save();

    
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         if (user.subscriptionPlan === 'basic') {

//             user.subscriptionPlan = 'premium';
//             user.trialEndDate = new Date(new Date().setMonth(new Date().getMonth() + 1)); 
//         } else if (user.subscriptionPlan === 'premium') {

//             user.monthlyRequestCount += 100; 
    
//         } else {
//             // Handle other subscription plans or cases
//         }

//         await user.save();

//         return res.status(200).json({ success: true, message: "Payment Verified and User Updated" });
//     } catch (error) {
//         console.error("Error processing payment:", error);
//         return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };
exports.verifyPayment = async (req, res) => {
    const { paymentId } = req.params;
    console.log("Payment ID is", paymentId);

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        console.log("Retrieved Payment Intent:", paymentIntent);

        if (paymentIntent.status !== "succeeded") {
            const metadata = paymentIntent.metadata;
            const subscriptionPlan = metadata.subscriptionPlan;
            const userEmail = metadata.userEmail;
            const userId = metadata.userId;
            console.log("Metadata retrieved:", metadata);

            const userFound = await User.findById(userId);
            if (!userFound) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const amount = paymentIntent?.amount / 100;
            const currency = paymentIntent?.currency;
            const paymentId = paymentIntent?.id;

            const newPayment = await Payment.create({
                user: userId,
                email: userEmail,
                subscriptionPlan,
                amount,
                currency,
                status: 'success',
                reference: paymentId,
                monthlyRequestCount: 0,
            });

            let updatedUser;

            if (subscriptionPlan === "Basic") {
                updatedUser = await User.findByIdAndUpdate(userId, {
                    subscriptionPlan,
                    trialPeriod: 0,
                    nextBillingDate: calculateNextBillingDate(),
                    apiRequestCount: 0,
                    subscriptionPlan: "Basic",
                    monthlyRequestCount: 50,
                    $addToSet: { payments: newPayment?._id },
                }, { new: true }); // Add { new: true } to return the updated document
            } else if (subscriptionPlan === "Premium") {
                updatedUser = await User.findByIdAndUpdate(userId, {
                    subscriptionPlan,
                    trialPeriod: 0,
                    nextBillingDate: calculateNextBillingDate(),
                    apiRequestCount: 0,
                    monthlyRequestCount: 100, // Corrected the request count for Premium
                    subscriptionPlan: "Premium",
                    $addToSet: { payments: newPayment?._id },
                }, { new: true }); // Add { new: true } to return the updated document
            }

            return res.status(200).json({
                success: true,
                message: "Payment verified, user updated",
                updatedUser,
            });
        } else {
            console.log("Payment not successful. Status:", paymentIntent.status);
            return res.status(400).json({
                success: false,
                message: `Payment not successful. Status: ${paymentIntent.status}`,
            });
        }
    } catch (error) {
        console.error("Error retrieving payment intent or updating user:", error);
        return res.status(500).json({
            success: false,
            message: "Unexpected error",
        });
    }
};
