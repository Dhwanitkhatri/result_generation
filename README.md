
# Student Result Generation API
_A smart and simple API to manage student results efficiently_

## Description
A RESTful API for managing student records, attendance, and results in a college ERP system.  
This API also calculates total marks and grade percentage for students automatically.

## Features
- Add, update, delete, and view students
- Generate and view student results
- Calculate total marks and grade percentage
- Role-based authentication (admin, faculty, student)
- Secure routes using JWT

## Technologies Used
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JSON Web Tokens (JWT)

## Installation
```bash
git clone https://github.com/Dhwanitkhatri/result_generation
cd result_generation
npm install
cp .env.example .env   # create your own .env file with DB credentials
npm run dev
````

## Environment Variables

Add the following variables in your `.env` file:

```
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
JWT_SECRET=
SUPER_SECRET_KEY=
PORT=
```

## API Endpoints

**Auth:**

```
POST /api/auth/login → Generate JWT
```

**For Student:**

```
GET /api/student/my → Show own details
GET /api/result/my → Show own result
```

**For Admin:**

```
GET /api/student → Retrieve all student details
GET /api/result → Retrieve all student results
GET /api/student/:id → Retrieve specific student details
GET /api/result/:id → Retrieve specific student result
POST /api/student → Add new student
POST /api/result → Add new result
PUT /api/student/:id → Update student details (name, rollNo, class, section)
PUT /api/result/:id → Update student result (subject, marks, maxMarks)
DELETE /api/student/:id → Delete student and all associated results
DELETE /api/result/:id → Delete specific student result
```

## Usage

Test all endpoints using Postman or any API testing tool.

## Contributing

Feel free to fork the repo and submit pull requests.



