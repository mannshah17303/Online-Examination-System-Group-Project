import mysql from "mysql2/promise";

export async function getConnection() {
  try {
    return await mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
  } catch (error) {
    throw new Error(error);
  }
}

export async function databaseQuery(query, values) {
  try {
    const connection = await getConnection();
    const [results, fields] = await connection.query(query, values);
    if (results) {
      connection.end();
      return results;
    }
  } catch (error) {
    throw new Error(error);
  }
}
