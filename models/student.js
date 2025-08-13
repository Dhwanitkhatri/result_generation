const user = require("./user");
const {DataTypes}=require("sequelize");
const sequelize = require("../config/db");

const student = sequelize.define('student',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    rollNo:{
        type:DataTypes.INTEGER,
        allowNull:false,
        unique:true
    },
    class:{
        type:DataTypes.STRING,
        allowNull:false
    },
    section:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

user.hasOne(student,{foreignKey:'userID',onDelete:'CASCADE'})
student.belongsTo(user,{foreignKey:'userID'})

module.exports=student;
