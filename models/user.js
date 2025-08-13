const sequelize=require("../config/db");
const {DataTypes} = require("sequelize");
const user = sequelize.define('user',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    role:{
        type:DataTypes.ENUM('admin','student'),
        allowNull:false
    }
}) 


module.exports=user;