import mysql from 'mysql'

// db connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "real_estate",
});

db.connect((err) => {
    if (err) new Error(err);
    console.log("db connected");
});

export default db