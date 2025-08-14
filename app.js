const express=require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db");
const result = require("./models/result");
const user = require("./models/user")
const student = require("./models/student")
const app = express();

const {authRoutes , studentRoutes , resultRoutes }=require("./routes");

app.use(cors());
app.use(express.json());
app.use('/api/auth/',authRoutes);
app.use('/api/student',studentRoutes);
app.use('/api/result',resultRoutes);

// test routes 
app.get('/',(req,res)=>{
    res.send("student result api running ");
})

sequelize.authenticate()
.then(()=>{
    console.log("database connected successfully ");
    return sequelize.sync({alter:true})
})
.then(()=>{
    console.log("all models are synced  ")
})
.catch(err=>{
    console.error("error ",err);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server listen on ${PORT}`))