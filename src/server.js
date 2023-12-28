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

app.listen(port, () => {
   console.log(`Server is listening on port ${port}`);
});
