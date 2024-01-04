const express = require('express');
const mysql = require('mysql2/promise');
const { getSqlData } = require('../helper');
const { dbConfig } = require('../cfg');

// Middleware import

// Create Routes
const postsRouter = express.Router();

// GET /api/posts - get all posts by params
postsRouter.get('/api/posts', async (req, res, next) => {
   // const sql = 'SELECT * FROM posts';
   const sql = `
   SELECT posts.post_id, posts.title, posts.author, posts.content, posts.date, COUNT(post_comments.comm_id) AS commentCount,
   categories.title AS categoryName
   FROM posts1
   JOIN categories
   ON posts.cat_id=categories.cat_id
   LEFT JOIN post_comments
   ON post_comments.post_id=posts.post_id
   GROUP BY posts.post_id
   `;

   const [postsArr, error] = await getSqlData(sql); //getting POST and ERROR from helper by passing sql param

   if (error) return next(error);
   res.json(postsArr);
});

// GET /api/post/:id - get post by ID
// SELECT * FROM `posts`
// WHERE post ID=postID;
postsRouter.get('/api/posts/:postId', async (req, res, next) => {
   const { postId } = req.params;

   const sql = 'SELECT * FROM posts WHERE post_id=?';
   const [postsArr, error] = await getSqlData(sql, [postId]);

   if (error) return next(error);

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
postsRouter.post('/api/posts/', async (req, res, next) => {
   console.log(req.body);
   const { title, author, date, content, cat_id } = req.body;

   const sql = `
    INSERT INTO posts (title, author, date, content, cat_id) 
    VALUES (?,?,?,?,?)
    `;

   const [postsArr, error] = await getSqlData(sql, [
      title,
      author,
      date,
      content,
      cat_id,
   ]);

   if (error) return next(error);

   if (postsArr.affectedRows === 1)
      res.json({ msg: `New Post Created successfully` });
});

// DELETE /api/posts/:postID by postID
postsRouter.delete('/api/posts/:postID', async (req, res, next) => {
   const { postID } = req.params;
   const sql = 'DELETE FROM posts WHERE post_id=? LIMIT 1';
   const [postsArr, error] = await getSqlData(sql, [postID]);

   if (error) return next(error);

   if (postsArr.affectedRows === 1)
      return res.json({ msg: `post with id ${postID} was deleted` });

   if (postsArr.affectedRows === 0)
      return res
         .status(500)
         .json(`DELETE Post with ID ${postID} was unsuccessfully. Check ID`);
});

// UPDATE by ID
// PUT /api/post/:postID - edit post by ID
postsRouter.put('/api/posts/:postID', async (req, res, next) => {
   const { postID } = req.params;
   const { title, author, date, content, cat_id } = req.body;

   const sql = `
    UPDATE posts
    SET title = ?, author = ?, date = ?, content = ?, cat_id = ?
    WHERE post_id = ?`;
   const [postsArr, error] = await getSqlData(sql, [
      title,
      author,
      date,
      content,
      cat_id,
      postID,
   ]);

   if (error) return next(error);

   if (postsArr.affectedRows === 1)
      return res.json({
         msg: `Post with id ${postID} was edited. ${postsArr.info}`,
      });

   if (postsArr.affectedRows === 0)
      return res
         .status(500)
         .json(`UPDATE Post with ID ${postID} was unsuccessfully. Check ID`);
});

module.exports = postsRouter;
