const express = require("express");
const router = express.Router();
const {authenticate , authorize } = require("../middlewares/auth");
const {sequelize} = require("../models");
const Result = require("../models/result");
const Student = require("../models/student");



// this will access by the student so they can see only there result 
router.get("/my", authenticate, authorize("student"), async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userID: req.user.id }, // userID comes from token
      include: [
        {
          model: Result,
          attributes: ["id", "subject", "marks", "Max_marks"],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found or no results available" });
    }

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message }); // lowercase "message", not error.Message
  }
});

//to get all result of all the students  for admin only 
router.get('/',authenticate,authorize("admin"),async(req,res)=>{
    try {
        const students = await Student.findAll({
            attributes: ["id", "name", "rollNo", "class", "section"],
            include: [
                {
                    model: Result,
                    attributes: ["id", "subject", "marks", "max_marks"]
                }
            ]
        });

        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No results found!" });
        }

        res.json(students);
    } catch (error) {
        res.status(500).json({Message : error.message})
    }
})

// this will access by admin to fetch the result of any individual student result 
router.get('/:id',authenticate,authorize("admin"),async (req,res)=>{
    try {
        const student = await Student.findByPk(req.params.id,{
            attributes: ["id", "name", "rollNo", "class", "section"],
            include: [
                {
                    model: Result,
                    attributes: ["id", "subject", "marks", "max_marks"]
                }
            ]
        });

        if (!student || student.length === 0) {
            return res.status(404).json({ message: "No results found!" });
        }

        res.json(student)
    } catch (error) {
        res.status(500).json({Message : error.message});
    }
})



//to add the result of  the student and can only be done by the admin
router.post('/',authenticate,authorize("admin"),async(req,res)=>{
        const transaction = await sequelize.transaction();
        try {
            const {studentID, subject , marks , maxMarks} = req.body;

            if(!studentID || !subject || marks == null || maxMarks == null) {// to check all information is provide or not 
                res.status(400).json({Message : "all fields are require "})
            }
            
            const student  = await Student.findByPk(studentID);

            if(!student) // to check student exits or not 
            {
                res.status(404).json({Message : ` student not found ${studentID}`});
            }

            const new_result = await Result.create({studentID , subject , marks,maxMarks},{transaction});

            await transaction.commit();
            res.status(201).json({
                Message : "result created ",
                result : new_result
            });

        } catch (error) {
            await transaction.rollback();
            res.status(500).json({Message : error.message})
        }
})
// to update the existing  result can only be accesss by admin
router.put('/:id',authenticate,authorize("admin"),async(req,res)=>{
    try {
        const {subject , marks , maxMarks } = req.body;
        const result = await Result.findByPk(req.params.id);

        if(!result) {// if result not exits 
            res.status(404).json({Message : "result not found "});
            }
        
        await result.update({subject , marks , maxMarks});
        res.status(201).json({
            Message : "update ",
            update : result
        })
    } catch (error) {
        res.status(500).json({Message : error.message});
    }
    
})
//to delete the student result and only be  access by admin
router.delete('/:id',authenticate,authorize("admin"),async(req,res)=>{
    try {
        const result = await Result.findByPk(req.params.id);

        if(!result)
        {
            res.status(404).json({Message: "result not found "})
        }
        await result.destroy();
        res.json({Message : "result deleted successfully "})
    } catch (error) {
        res.status(500).json({Message : error.Message})
    }

})


module.exports=router;