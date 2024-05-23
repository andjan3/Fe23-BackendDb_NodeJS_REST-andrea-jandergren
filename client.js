/*

 Final project Back End (FE23 Grit Academy)
 Andréa Jandergren

 This file contains the routes and logic for handling GUI pages and serve CRUD-operations in the database.

*/

import { Router } from 'express';
import * as db from "./db.js";

const clientRoutes = Router();
let currentTable;

clientRoutes.get('/', async (req, res) => {
  const pageTitle = "Dynamic webpage";
  const sql = 'SHOW tables';
  try {
    const dbData = await db.query(sql);
    res.render('index', { pageTitle, dbData });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Error executing query.');
  }
});

clientRoutes.post('/', async (req, res) => {
  const pageTitle = "Dynamic webpage";
  const tableName = req.body.table_name;
  currentTable = tableName;
  
  let sql;
  let dbData;
  let dbDataHeaders;

  try {
    sql = createSqlQuery(currentTable);

    dbData = await db.query(sql);
    dbDataHeaders = await getTableDescription(tableName);

    res.render('index', { pageTitle, dbData, dbDataHeaders });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Error executing query.');
  }
});

clientRoutes.get('/create', async (req, res) => {
  const pageTitle = "Create";
  if (!currentTable) {
    res.status(400).send('Current table not set.');
    return;
  }
  try {
    const sql = `SELECT * FROM ${currentTable}`;

    const dbData = await db.query(sql);
    const dbDataHeaders = await getTableDescription(currentTable); 

    res.render('create', { pageTitle, dbData, dbDataHeaders });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Error executing query.');
  }
});

clientRoutes.post('/create', async (req, res) => {
  const pageTitle = "Create";
  const requestData = req.body;
  console.log(requestData);
  
  const keys = Object.keys(requestData).join(', ');
  const values = Object.values(requestData).map(value => {
    const val = typeof value === 'string' ? `'${value}'` : value;
    return val;
  }).join(', ');

  const sqlCreateQuery = `
    INSERT INTO ${currentTable}
    (${keys})
    VALUES (${values});
  `;
  try {
    await db.query(sqlCreateQuery);

    const sql = `SELECT * FROM ${currentTable}`;

    const dbData = await db.query(sql);
    const dbDataHeaders = await getTableDescription(currentTable); 

    res.render('create', { pageTitle, dbData, dbDataHeaders });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Error executing query.');
  }
});

clientRoutes.get('/update', async (req, res) => {
  const pageTitle = "Update";
  if (!currentTable) {
      res.status(400).send('Current table not set.');
      return;
  }
  let sql;
  sql = createSqlQuery(currentTable);
  const dbDataHeaders = await getTableDescription(currentTable);
  const dbData = await db.query(sql);

  res.render('update', { pageTitle, dbData, dbDataHeaders });
});

clientRoutes.post('/update', async (req, res) => {
  const pageTitle = "Update";
  const requestData = req.body;

  const keys = Object.keys(requestData);
  const values = Object.values(requestData);

  const keyValuesArr = keys.map((key, i) => {
    const value = typeof values[i] === 'string' ? `'${values[i]}'` : values[i];
    return `${key} = ${value}`;
  });

  const setClauseArr = keyValuesArr.filter(requestData => !requestData.startsWith('id ='));
  const whereClauseArr = keyValuesArr.filter(requestData => requestData.startsWith('id ='));
  
  const setClause = setClauseArr.join(', ');
  const whereClause = whereClauseArr.join(' AND ');

  const sqlUpdateQuery = `
    UPDATE ${currentTable}
    SET ${setClause}
    WHERE ${whereClause}
  `;

  try {
    await db.query(sqlUpdateQuery);

    const sql = `SELECT * FROM ${currentTable}`;
    const dbData = await db.query(sql);
    const dbDataHeaders = await getTableDescription(currentTable);

    res.render('update', { pageTitle, dbData, dbDataHeaders });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Error executing query.');
  }
});

clientRoutes.get('/removeData', async (req, res) => {
  const pageTitle = "Remove";
  if (!currentTable) {
      res.status(400).send('Current table not set.');
      return;
  }
  const sql = `SELECT * FROM ${currentTable}`;

  const dbData = await db.query(sql);
  const dbDataHeaders = await getTableDescription(currentTable);
  res.render('removeData', { pageTitle, dbData, dbDataHeaders });
});

clientRoutes.post('/removeData', async (req, res) => {
  const pageTitle = "Remove";
  const requestData = req.body;

  try {
    const deleteAssociationQuery = `
      DELETE FROM students_courses 
      WHERE students_id = ? OR courses_id = ?`;
    await db.query(deleteAssociationQuery, [requestData.id, requestData.id]);

    const deleteEntityQuery = `
      DELETE FROM ${currentTable} 
      WHERE id = ?`;
    await db.query(deleteEntityQuery, [requestData.id]);

    const sql = `SELECT * FROM ${currentTable}`;
    const dbData = await db.query(sql);
    const dbDataHeaders = await getTableDescription(currentTable);

    res.render('removeData', { pageTitle, dbData, dbDataHeaders });

  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Error executing query.');
  }
});

function createSqlQuery(currentTable){
  let sql;
  if (currentTable === 'students_courses') {
    sql = `
    SELECT sc.id AS row_id, sc.students_id, sc.courses_id, s.fName AS 'firstname', s.lName AS 'lastname', s.town, c.name AS 'coursename', c.description
    FROM students_courses sc
    LEFT JOIN students s ON sc.students_id = s.id
    LEFT JOIN courses c ON sc.courses_id = c.id;
`    
  } else if (currentTable === 'students') {
    sql = `SELECT students.id AS 'row_id', students.fName AS 'Firstname', students.lName AS 'Lastname', students.town 
    FROM \`${currentTable}\``;
  } else {
    sql = `SELECT courses.id AS 'row_id', courses.name AS 'Coursename', courses.description FROM \`${currentTable}\``;
  }

  return sql;
}

async function getTableDescription(tableName) {
  try {
    const sql = `DESCRIBE \`${tableName}\``;
    const dbDataHeaders = await db.query(sql);
    return dbDataHeaders;
  } catch (error) {
    console.error('Error describing table:', error);
    throw error;
  }
}

export default clientRoutes;