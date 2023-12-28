const express = require('express');
const mysql = require('mysql2/promise');
const { dbConfig } = require('../cfg');

// Middleware import
const { handleErrors, asyncHandler } = require('../middleware');

// Create Routes
const postsRouter = express.Router();

let connection;
const pool = mysql.createPool(dbConfig);

// GET /api/posts - get all posts
// SELECT * FROM `posts`
postsRouter.get(
   '/api/posts',
   asyncHandler(async (req, res) => {
      const [rows] = await pool.execute('SELECT * FROM posts');
      res.json(rows);
   })
);

postsRouter.use(handleErrors);

// GET /api/post/:id - get post by ID
// SELECT * FROM `posts`
// WHERE post ID=postID;
postsRouter.get('/api/posts/:postID', async (req, res) => {
   const { postID } = req.params;

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
      console.warn('return post by ID error', error);
      res.status(500).json('something wrong');
   } finally {
      if (connection) connection.end();
   }
});

// CREATE /api/post/ - create new post
// INSERT INTO posts (title, author, date, content) VALUES (?, ?, ?, ?)
postsRouter.post('/api/posts/', async (req, res) => {
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
      console.warn('CREATE post error', error);
      res.status(500).json('something wrong');
   }
});

// DELETE /api/posts/:postID by postID
postsRouter.delete('/api/posts/:postID', async (req, res) => {
   const { postID } = req.params;

   try {
      connection = await mysql.createConnection(dbConfig);
      const sql = 'DELETE FROM posts WHERE post_id=?';
      const [rows] = await connection.execute(sql, [postID]);
      if (rows.affectedRows === 1) {
         res.json({
            msg: `post with ID ${postID} was deleted`,
         });
         return;
      }
      res.status(400).json({ msg: 'no rows affected', rows });
   } catch (error) {
      console.warn('DELETE post error', error);
      res.status(500).json('something wrong');
   } finally {
      if (connection) connection.end();
   }
});

module.exports = postsRouter;
