const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/auth");
const { sequelize } = require("../models"); // Sequelize instance
const Student = require("../models/student");
const User = require("../models/user");
const Result = require("../models/result");
const bcrypt = require("bcrypt");

// Get own student details (student)
router.get("/my", authenticate, authorize("student"), async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userID: req.user.id },
      attributes: ["id", "name", "rollNo", "class", "section"],
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all students (admin)
router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const students = await Student.findAll({
      include: {
        model: User,
        attributes: { exclude: ["password"] },
      },
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single student by ID (admin)
router.get("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: { exclude: ["password"] },
      },
    });

    if (!student) {
      return res
        .status(404)
        .json({ message: `Student not found with ID ${req.params.id}` });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add student (admin)
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { username, password, name, rollNo, class: cls, section } = req.body;

    if (!username || !password || !name || !rollNo || !cls || !section) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create(
      { username, password: hashPassword, role: "student" },
      { transaction }
    );

    // Create student linked to user
    const newStudent = await Student.create(
      { name, rollNo, class: cls, section, userID: newUser.id },
      { transaction }
    );

    await transaction.commit();

    // Remove password before sending response
    delete newUser.dataValues.password;

    res.status(201).json({
      message: "Student created successfully",
      user: newUser,
      student: newStudent,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
});

// Update student (admin)
router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, rollNo, class: cls, section } = req.body;
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res
        .status(404)
        .json({ message: `Student not found with ID ${req.params.id}` });
    }

    await student.update({ name, rollNo, class: cls, section });

    res.json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete student + linked user + results (admin)
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const student = await Student.findByPk(req.params.id, { transaction });

    if (!student) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: `Student not found with ID ${req.params.id}` });
    }

    // Delete related results
    if ((await Result.count({ where: { studentID: student.id }, transaction })) > 0) {
      await Result.destroy({ where: { studentID: student.id }, transaction });
    }

    // Find linked user
    const user = await User.findByPk(student.userID, { transaction });

    // Delete student
    await student.destroy({ transaction });

    // Delete linked user if exists
    if (user) {
      await user.destroy({ transaction });
    }

    await transaction.commit();

    res.json({
      message: "Student, linked user, and related results deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
