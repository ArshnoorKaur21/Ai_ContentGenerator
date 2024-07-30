const express=require('express');
const { register, login, logout, checkAuthenticated, profile } = require("../controllers/User");
const isAuthenticated = require('../middlewares/isAuthenticated');
const userRouter=express.Router();
userRouter.post("/users/register",register)
userRouter.post("/users/login",login)
userRouter.post("/users/logout",logout)
userRouter.get("/users/checkAuth",isAuthenticated,checkAuthenticated)
userRouter.get("/users/profile",isAuthenticated,profile);
module.exports=userRouter;