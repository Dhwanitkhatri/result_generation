const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/auth");
const { sequelize } = require("../models");
const Result = require("../models/result");
const Student = require("../models/student");
const { calculateResultSummary } = require("../utils/resultUtils");

// Accessed by students to see only their results
router.get("/my", authenticate, authorize("student"), async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userID: req.user.id }, // userID comes from token
      include: [
        {
          model: Result,
          attributes: ["subject", "marks", "Max_marks"],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found or no results available" });
    }

    const summary = calculateResultSummary(student.results || []);

    res.json({
      student,
      summary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Accessed by admin to get all students' results
router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: ["id", "name", "rollNo", "class", "section"],
      include: [
        {
          model: Result,
          attributes: ["subject", "marks", "Max_marks"],
        },
      ],
    });

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No results found!" });
    }

    const data = students.map((student) => {
      const results = student.Results || student.results || [];
      const summary = calculateResultSummary(results);

      return {
        student,
        summary,
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accessed by admin to get a specific student's result
router.get("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      attributes: ["id", "name", "rollNo", "class", "section"],
      include: [
        {
          model: Result,
          attributes: ["subject", "marks", "Max_marks"],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: "No results found!" });
    }

    const summary = calculateResultSummary(student.Results || student.results || []);

    res.json({
      student,
      summary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accessed by admin to add a new result
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { studentID, subject, marks, maxMarks } = req.body;

    if (!studentID || !subject || marks == null || maxMarks == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = await Student.findByPk(studentID);
    if (!student) {
      return res.status(404).json({ message: `Student not found: ${studentID}` });
    }

    const new_result = await Result.create(
      { studentID, subject, marks, maxMarks },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json({
      message: "Result created",
      result: new_result,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
});

// Accessed by admin to update an existing result
router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { subject, marks, maxMarks } = req.body;
    const result = await Result.findByPk(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    await result.update({ subject, marks, maxMarks });

    res.status(200).json({
      message: "Result updated",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accessed by admin to delete a result
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const result = await Result.findByPk(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    await result.destroy();
    res.json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
