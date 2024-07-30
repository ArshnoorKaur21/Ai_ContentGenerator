const mongoose = require("mongoose");

const Userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    trialActive: {
        type: Boolean,
        default: true,
    },
    trialPeriod:{
        type:Number,
        default:3,
    },
    trialExpires: {
        type: Date,
    },
    subscriptionPlan: {
        type: String,
        enum: ["Trial", "Free", "Basic", "Premium"],
        default:"Trial"
    },
    apiRequestCount: {
        type: Number,
        default: 0,
    },
    monthlyRequestCount: {
        type: Number,
        default: 100,
    },
    nextBillingDate: Date,
    payments: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Payment"
    }],
    history: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "History"
    }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Userschema.virtual("isTrialActive").get(function() {
//     return this.trialActive && new Date() < this.trialExpires;
// });

module.exports = mongoose.model("User", Userschema);
