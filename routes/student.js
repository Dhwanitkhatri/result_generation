const express = require("express");
const router = express.Router();
const {authenticate , authorize } = require("../middlewares/auth");

//get // to list all the student form admin only 
router.get("/",authenticate,authorize("admin"),(req,res)=>{
    //fetch all the student details 
    res.json({message:"all student details "});
})

router.get("/:id",authenticate,(req,res)=>{
    //TODO : if admin or seld student details 
    res.json({Message:`details of student ${req.params.id}`});
})

router.post("/",authenticate,authorize("admin"),(req,res)=>{
    // todo : to add the new student details 
    res.json({Message : "new student created "});
})
router.put("/:id",authenticate,(req,res)=>{
    //todo to update the students or self 
    res.json({Message : "update the student otr self "});
})
router.delete("/:id",authenticate,authorize("admin"),(req,res)=>{
    //todo delete any student 
    res.json({Message : ` delete the record of the ${req.params.id}`})
})


module.exports=router;