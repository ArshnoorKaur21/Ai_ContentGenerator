const mongoose = require("mongoose");
require('dotenv').config();
exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{

    })
    .then(console.log("DB Connected succesffully")).catch((error)=>{
        console.log("DDATABASE ERROR ");
        console.log(error);
        process.exit(1);

    })
}