/*

 Final project Back End (FE23 Grit Academy)
 Andréa Jandergren

 This file contains API routes and logic for handling Create, Read and Delete operations in the database.

*/

import { Router } from 'express';
import * as db from "./db.js";

const apiRoutes = Router();

//Helper function that performs an SQL query against the database and send the result as JSON to the client.
const queryDb = async (sql, params, res) => {
  try {
    const dbData = await db.query(sql, params);
    res.json(dbData);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Error executing query.');
  }
};

// Get a list of all students
apiRoutes.get('/students', (req, res) => {
  const sql =  `SELECT * FROM students`;
  queryDb(sql, [], res);
});

// Get a list of all courses 
apiRoutes.get('/courses', (req, res) => {
  const sql = `SELECT * FROM courses`;
  queryDb(sql, [], res);
});

// Get all student-course associations
apiRoutes.get('/studentsCourses', (req, res) => {
  const sql = `
  SELECT 
    sc.id AS students_courses_id,
    sc.students_id,
    sc.courses_id,
    s.id AS student_id,
    s.fName,
    s.lName,
    s.town,
    c.id AS course_id,
    c.name AS course_name,
    c.description
  FROM students_courses sc
  JOIN students s ON sc.students_id = s.id
  JOIN courses c ON sc.courses_id = c.id
`;
  queryDb(sql, [], res);
});

// Get a specific student-course association by student id
apiRoutes.get('/studentCourse/:studentId', (req, res) => {
  const { studentId } = req.params;
  const sql = `
    SELECT s.id AS student_id, s.fName, s.lName, c.name AS coursename FROM students_courses sc
    JOIN students s ON sc.students_id = s.id
    JOIN courses c ON sc.courses_id = c.id
    WHERE s.id = ?
  `;
  queryDb(sql, [studentId], res);
});

// Get student-course associations by first name
apiRoutes.get('/studentCourseByFirstname/:firstName', (req, res) => {
  const { firstName } = req.params;
  const sql = `
    SELECT s.fName, s.lName, c.name AS coursename FROM students s
    LEFT JOIN students_courses sc ON sc.students_id = s.id
    LEFT JOIN courses c ON sc.courses_id = c.id
    WHERE s.fName = ?
  `;
  queryDb(sql, [firstName], res);
});

// Get student-course associations by last name
apiRoutes.get('/studentCourseByLastname/:lastName', (req, res) => {
  const { lastName } = req.params;
  const sql = `
    SELECT s.fName, s.lName, c.name AS coursename FROM students s
    LEFT JOIN students_courses sc ON sc.students_id = s.id
    LEFT JOIN courses c ON sc.courses_id = c.id
    WHERE s.lName = ?
  `;
  queryDb(sql, [lastName], res);
});

// Get student-course associations by town
apiRoutes.get('/studentCourseByTown/:town', (req, res) => {
  const { town } = req.params;
  const sql = `
    SELECT s.fName, s.lName, s.town, c.name AS coursename, c.description FROM students_courses sc
    LEFT JOIN students s ON sc.students_id = s.id
    LEFT JOIN courses c ON sc.courses_id = c.id
    WHERE s.town = ?
  `;
  queryDb(sql, [town], res);
});

// Get course and students by course id
apiRoutes.get('/studentsByCourse/:courseId', (req, res) => {
  const { courseId } = req.params;
  const sql = `
    SELECT c.id AS course_id, c.name AS coursename, c.description, s.fName, s.lName, s.town FROM students_courses sc
    JOIN courses c ON sc.courses_id = c.id
    JOIN students s ON sc.students_id = s.id
    WHERE c.id = ?
  `;
  queryDb(sql, [courseId], res);
});

// Get courses and students by specific course name
apiRoutes.get('/courseAndStudents/:coursename', (req, res) => {
  const { coursename } = req.params;
  const sql = `
    SELECT c.id AS course_id, s.id AS student_id, c.name AS coursename, c.description, s.fName, s.lName, s.town FROM students_courses sc
    INNER JOIN courses c ON sc.courses_id = c.id
    INNER JOIN students s ON sc.students_id = s.id
    WHERE c.name = ?
  `;
  queryDb(sql, [coursename], res);
});

// Get one courses by word in coursename
apiRoutes.get('/courseByWordInCourseName/:word', (req, res) => {
  const { word } = req.params;
  const searchTerm = `%${word}%`;
  const sql = `
    SELECT* 
    FROM courses c
    WHERE name LIKE ?
    LIMIT 1
  `;
  queryDb(sql, [searchTerm], res);
});

// Get one course by word in description
apiRoutes.get('/courseByWordInDescription/:word', (req, res) => {
  const { word } = req.params;
  const searchTerm = `%${word}%`;
  const sql = `
    SELECT* 
    FROM courses c
    WHERE description LIKE ?
    LIMIT 1
  `;
  queryDb(sql, [searchTerm], res);
});

// Add a course
apiRoutes.post('/courses/add', (req, res) => {
  const { name, description } = req.body;
  const sql = "INSERT INTO courses (`name`, `description`) VALUES (?, ?)";
  queryDb(sql, [name, description], res);
});

// Remove a course by id
apiRoutes.post('/courses/remove/:courseId', async (req, res) => {
  const { courseId } = req.params;
  try {
    await db.query(`DELETE FROM students_courses WHERE courses_id = ?`, [courseId]);
    const dbData = await db.query(`DELETE FROM courses WHERE id = ?`, [courseId]);
    res.json(dbData);
  } catch (error) {
    console.error('Error removing course:', error);
    res.status(500).send('Error removing course.');
  }
});

// Add a student
apiRoutes.post('/student/add', (req, res) => {
  const { fName, lName, town } = req.body;
  const sql = "INSERT INTO students (`fName`, `lName`, `town`) VALUES (?, ?, ?)";
  queryDb(sql, [fName, lName, town], res);
});

// Remove a student by id
apiRoutes.post('/student/remove/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM students_courses WHERE students_id = ?`, [id]);
    const dbData = await db.query(`DELETE FROM students WHERE id = ?`, [id]);
    res.json(dbData);
  } catch (error) {
    console.error('Error removing student:', error);
    res.status(500).send('Error removing student.');
  }
});

// Add a student-course association
apiRoutes.post('/student/course/add/:studentId/:courseId', (req, res) => {
  const { studentId, courseId } = req.params;
  const sql = "INSERT INTO students_courses (`students_id`, `courses_id`) VALUES (?, ?)";
  queryDb(sql, [studentId, courseId], res);
});

// Remove a student-course association by id
apiRoutes.post('/student/course/remove/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM students_courses WHERE id = ?";
  queryDb(sql, [id], res);
});

export default apiRoutes;



