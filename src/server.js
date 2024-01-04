require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const postsRouter = require('./routes/postRoutes');

const app = express();

const port = process.env.PORT || 5000;

let connection;

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
   res.json('Hello World!');
});

// Posts Routes
app.use('/', postsRouter);

// ERROR handler
app.use((err, req, res, next) => {
   console.log('error from error handler', err);

   if (err.status) return res.status(err.status).json({ error: err.message });

   switch (err.code) {
      case 'ERP_DUP_ENTRY':
         res.status(400);
         res.json({ msg: err.sqlMessage || 'no such table' });
         return;
      default:
   }

   res.status(500);
   res.json('Server ERROR (from handler))');
});

app.listen(port, () => {
   console.log(`Server is listening on port ${port}`);
});
