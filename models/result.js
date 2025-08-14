const user = require("./user");
const student = require("./student");
const {DataTypes} = require("sequelize")
const sequelize = require("../config/db")
const result = sequelize.define('result',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    subject:{
        type:DataTypes.STRING,
        allowNull:false
    },
    marks:{
        type:DataTypes.DECIMAL,
        allowNull:false
    },
    Max_marks:{
        type:DataTypes.DECIMAL,
        allowNull:false,
        defaultValue:100
    }
})
student.hasMany(result,{foreignKey:'studentID',onDelete:'CASCADE'});
result.belongsTo(student,{foreignKey:'studentID'});

module.exports=result;