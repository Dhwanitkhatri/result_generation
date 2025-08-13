const express=require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/db");
const app = express();

app.use(cors());

// test routes 
app.get('/',(req,res)=>{
    res.send("student result api running ");
})

sequelize.authenticate()
.then(()=>{
    console.log("database connected successfully ")
})
.catch(err=>{
    console.error("error ",err);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server listen on ${PORT}`))