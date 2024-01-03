const express = require('express');
const mysql = require('mysql2/promise');
const { getSqlData } = require('../helper');
const { dbConfig } = require('../cfg');

// Middleware import

// Create Routes
const postsRouter = express.Router();

// GET /api/posts - get all posts by params
postsRouter.get('/api/posts', async (req, res) => {
   // const sql = 'SELECT * FROM posts';
   const sql = `
   SELECT posts.post_id, posts.title, posts.author, posts.content, posts.date, COUNT(post_comments.comm_id) AS commentCount,
   categories.title AS categoryName
   FROM posts
   JOIN categories
   ON posts.cat_id=categories.cat_id
   LEFT JOIN post_comments
   ON post_comments.post_id=posts.post_id
   GROUP BY posts.post_id
   `;

   const [postsArr, error] = await getSqlData(sql); //getting POST and ERROR from helper by passing sql param

   if (error) {
      console.log('error ===', error);
      res.status(500).json('something wrong');
      return;
   }
   res.json(postsArr);
});

// GET /api/post/:id - get post by ID
// SELECT * FROM `posts`
// WHERE post ID=postID;
postsRouter.get('/api/posts/:postId', async (req, res) => {
   const { postId } = req.params;

   const sql = 'SELECT * FROM posts WHERE post_id=?';
   const [postsArr, error] = await getSqlData(sql, [postId]);

   if (error) {
      console.log('error ===', error);
      res.status(500).json('something wrong');
      return;
   }

   if (postsArr.length === 1) {
      res.json(postsArr[0]);
      return;
   }
   if (postsArr.length === 0) {
      res.status(404).json({ msg: `post by ${postId} not found` });
      return;
   }
   res.status(400).json(postsArr);
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
