/*

 Final project Back End (FE23 Grit Academy)
 Andréa Jandergren

 Sets up an node.js/Express server to handle API routes and GUI pages.

*/

import express from "express";
import ejs from "ejs";
import cors from "cors";
import bodyParser from "body-parser";
import clientRoutes from './client.js';
import apiRoutes from './api.js';

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors());

app.use('/api', apiRoutes);
app.use('/', clientRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
