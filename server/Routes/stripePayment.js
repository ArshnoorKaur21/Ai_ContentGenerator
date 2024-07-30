const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { handlestripePayment, handleFreeSubscription, verifyPayment } = require("../controllers/Payment");
const stripeRouter= express.Router();;

stripeRouter.post("/pay",isAuthenticated, handlestripePayment);
stripeRouter.post("/free-plan",isAuthenticated, handleFreeSubscription);
stripeRouter.post("/verify/:paymentId", verifyPayment);
module.exports = stripeRouter;
