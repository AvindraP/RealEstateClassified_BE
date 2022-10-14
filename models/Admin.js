import db from "../config/DB.js";

const Admin = {
  table: "admins",

  insert(userId, data, callBack) {
    const keys = ["user_id", "email", "password", "phone"];
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

  get(req, res) {
    const id = req.param("id");
    if (id) {
      const query = `SELECT ${this.table}.*, users.name
                           FROM ${this.table}
                                    LEFT JOIN users
                                              ON ${this.table}.user_id = users.id
                           WHERE ${this.table}.id = ${id}`;
      db.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ data: result });
      });
    } else {
      const query = `SELECT ${this.table}.*, users.name
                           FROM ${this.table}
                                    LEFT JOIN users
                                              ON ${this.table}.user_id = users.id`;
      db.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ data: result });
      });
    }
  },

  update(req, res) {
    const email = req.body.email;
    const id = req.body.id;

    if (!id) res.send("id is required!");

    const update = (callBack) => {
      const query = `UPDATE ${this.table}
                           SET email='${email}',
                               website = '${req.body.website}',
                               logo = '${req.body.logo}'
                           WHERE id = ${id}`;
      db.query(query, (err, result) => {
        if (err) console.log(err);
        else callBack(true);
      });
    };

    if (email)
      validate.uniqueEmail(email, id, (r) => {
        r
          ? res.send("This email has already been taken")
          : update((r) => {
              r ? res.send("updated") : res.send("Something went wrong");
            });
      });
    else {
      update((r) => {
        r ? res.send("updated") : res.send("Something went wrong");
      });
    }
  },

  block(req, res) {
    const id = req.param("id");
    status.block(id, this.table, (r) => {
      r ? res.send("blocked") : res.send("something went wrong");
    });
  },

  active(req, res) {
    const id = req.param("id");
    status.active(id, this.table, (r) => {
      r ? res.send("activated") : res.send("something went wrong");
    });
  },
};

export default Admin;
