const express = require("express");
const router = express.Router();
const {authenticate , authorize } = require("../middlewares/auth");



router.get('/',authenticate,authorize("admin"),(req,res)=>{
    //todo fetch result of all the student 
    res.json({message:"result of student "})
})
router.get('/:id',authenticate,(req,res)=>{
    //todo fetch the result of a student or self 
    res.json({message : `the result of student ${req.params.id}`})
})
router.post('/',authenticate,authorize("admin"),(req,res)=>{
    //todo add the result of the student 
    res.json({Message : "result add "});
})
router.put('/:id',authenticate,authorize("admin"),(req,res)=>{
    //todo update the result of a student u using the id 
    res.json({message : `result update of student ${req.params.id}`})
})

router.delete('/:id',authenticate,authorize("admin"),(req,res)=>{
    //todo delete the result of a student using id 
    res.json({Message:`result deleted of ${req.params.id}`})
})


module.exports=router;