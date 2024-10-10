import mysql from "mysql2"

export const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "Myfamily@1234",
    database: "blog",
}); 