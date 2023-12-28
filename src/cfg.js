const dbConfig = {
   database: process.env.DB_DATABASE,
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
};

// console.log('dbConfig ===', dbConfig);

module.exports = {
   dbConfig,
};
