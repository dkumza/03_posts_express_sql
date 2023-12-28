require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { dbConfig } = require('./cfg');

const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
   res.json('Hello World!');
});

// GET /api/posts - get all posts
// SELECT * FROM `posts`
app.get('/api/posts', async (req, res) => {
   let connection;
   try {
      // log in
      connection = await mysql.createConnection(dbConfig);
      // returns rows
      const [rows, fields] = await connection.execute('SELECT * FROM `posts`');
      res.json(rows);
      // log out
      connection.end();
   } catch (error) {
      console.warn('/api/posts', error);
      res.status(500).json('something wrong');
   } finally {
      if (connection) connection.end();
   }
});

// GET /api/post/:id - get post by ID
// SELECT * FROM `posts`
// WHERE post ID=postID;
app.get('/api/posts/:postID', async (req, res) => {
   const { postID } = req.params;
   console.log(postID);

   let connection;
   try {
      connection = await mysql.createConnection(dbConfig);

      const sql = 'SELECT * FROM posts WHERE post_id=?';

      const [rows, fields] = await connection.execute(sql, [postID]);
      if (rows.length === 1) {
         res.json(...rows);
         return;
      }
      res.status(400).json(rows);
   } catch (error) {
      console.warn('single post err', error);
      res.status(500).json('something wrong');
   } finally {
      if (connection) connection.end();
   }
});
// CREATE /api/post/ - create new post
// INSERT INTO posts (title, author, date, content) VALUES (?, ?, ?, ?)
app.post('/api/posts/', async (req, res) => {
   console.log(req.body);

   try {
      // log in
      const connection = await mysql.createConnection({
         database: 'bit_main',
         host: 'localhost',
         user: 'root',
         password: '',
      });
      // returns rows
      const sql = `INSERT INTO posts (title, author, date, content) VALUES (?, ?, ?, ?)`;
      const [rows, fields] = await connection.execute(sql, [
         req.body.title,
         req.body.author,
         req.body.date,
         req.body.content,
      ]);
      res.json(rows);
      // log out
      connection.end();
   } catch (error) {
      console.warn('/api/posts/:id', error);
      res.status(500).json('something wrong');
   }
});

app.listen(port, () => {
   console.log(`Server is listening on port ${port}`);
});
