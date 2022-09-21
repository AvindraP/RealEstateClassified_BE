import db from "../config/DB.js";

const Admin = {
  table: "admins",

  insert(userId, data, callBack) {
    const keys = ["user_id", "email"];
    const arr = [];
    keys.forEach((key) => {
      if (key === "user_id") data[key] = userId;
      arr.push(data[key]);
    });
    const query = `INSERT INTO ${this.table} (${keys.toString()})
                       VALUES (?, ?)`;
    db.query(query, arr, (err, res) => {
      if (err) console.log(res);
      else callBack(res.insertId);
    });
  },
};

export default Admin;
