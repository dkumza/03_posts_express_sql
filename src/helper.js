const mysql = require('mysql2/promise');
const { dbConfig } = require('./cfg');

async function getSqlData(sql, argArr = []) {
   let connection;
   try {
      connection = await mysql.createConnection(dbConfig); // connecting to DB
      const [rows] = await connection.execute(sql, argArr); // execute task
      return [rows, null];
   } catch (error) {
      console.warn('getSqlData', error);
      return [null, error];
   } finally {
      if (connection) connection.end(); // disconnecting
      console.log('after connection end');
   }
}

module.exports = {
   getSqlData,
};
