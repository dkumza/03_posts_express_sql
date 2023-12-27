require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2/promise');

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
   try {
      // log in
      const connection = await mysql.createConnection({
         database: 'bit_main',
         host: 'localhost',
         user: 'root',
         password: '',
      });
      // returns rows
      const [rows, fields] = await connection.query('SELECT * FROM `posts`');
      res.json(rows);
      // log out
      connection.end();
   } catch (error) {
      console.warn('/api/posts', error);
      res.status(500).json('something wrong');
   }
});

// GET /api/post/:id - get post by ID
// SELECT * FROM `posts`
// WHERE CustomerID=id;
app.get('/api/posts/:id', async (req, res) => {
   const postID = req.params.id;
   try {
      // log in
      const connection = await mysql.createConnection({
         database: 'bit_main',
         host: 'localhost',
         user: 'root',
         password: '',
      });
      // returns rows
      const [rows, fields] = await connection.query(
         `SELECT * FROM posts WHERE post_id=${postID}`
      );
      res.json(rows);
      // log out
      connection.end();
   } catch (error) {
      console.warn('/api/posts/:id', error);
      res.status(500).json('something wrong');
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
      const query = `INSERT INTO posts (title, author, date, content) VALUES (?, ?, ?, ?)`;
      const [rows, fields] = await connection.query(query, [
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
