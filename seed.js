// seed.js
const bcrypt = require('bcrypt');
const sequelize = require('./config/db');
const User = require('./models/user');
const Student = require('./models/student');
const Result = require('./models/result');

async function seed() {
  try {
    await sequelize.sync({ alter: true }); // Ensure tables exist

    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const users = [];
    const students = [];

    // -------- USERS --------
    for (let i = 1; i <= 10; i++) {
      const role = i === 1 ? 'admin' : 'student'; // first user is admin
      const user = await User.create({
        username: role === 'admin' ? 'adminUser' : `student${i}`,
        password: hashedPassword,
        role: role
      });
      users.push(user);

      // -------- STUDENTS -------- (only for students)
      if (role === 'student') {
        const student = await Student.create({
          name: `Student ${i}`,
          rollNo: 100 + i,
          class: '10',
          section: 'A',
          userID: user.id
        });
        students.push(student);
      }
    }

    // -------- RESULTS --------
    for (const student of students) {
      await Result.bulkCreate([
        { studentID: student.id, subject: 'Math', marks: Math.floor(Math.random() * 41) + 60},
        { studentID: student.id, subject: 'Science', marks: Math.floor(Math.random() * 41) + 60},
        { studentID: student.id, subject: 'English', marks: Math.floor(Math.random() * 41) + 60 },
      ]);
    }

    console.log('Seeding 10 users/students completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
