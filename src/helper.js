const mysql = require('mysql2/promise');
const { dbConfig } = require('./cfg');

const pool = mysql.createPool(dbConfig);

async function getSqlData(sql, argArr = []) {
   console.log(argArr);
   let connection;
   try {
      connection = await pool.getConnection(); // connecting to DB
      const [rows] = await connection.execute(sql, argArr); // execute task
      return [rows, null];
   } catch (error) {
      console.error('getSqlData', error);
      return [null, error];
   } finally {
      if (connection) connection.release();
   }
}

module.exports = {
   getSqlData,
};
