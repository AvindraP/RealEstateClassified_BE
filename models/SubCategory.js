import validator from "fastest-validator";
import validate from "../request/SubCategoryPostRequest.js";
import db from "../config/DB.js";
import status from "../helpers/status.js";

const Category = {
  table: "sub_categories",

  schema: {
    category_id: { type: "number", optional: "false" },
    fields: { type: "string", optional: "false" },
    name: { type: "string", optional: "false" },
  },

  create(req, res) {
    const keys = Object.keys(req.body);
    const arr = [];
    let user = [];

    keys.forEach((key) => {
      arr.push(req.body[key]);
    });

    keys.forEach((key) => {
      let obj = {};
      obj[key] = req.body[key];
      user.push(obj);
    });

    user = Object.assign({}, ...user);

    const v = new validator();
    const validateResponse = v.validate(user, this.schema);

    if (validateResponse && validateResponse.length > 0) {
      res.send(validateResponse);
    } else {
      validate.uniqueName(req.body.name, (r) => {
        r
          ? res.send("this name has been already taken")
          : this.insert(req.body, (r) => {
              r
                ? res.send(`add ${r.insertId}`)
                : res.send("Something went wrong");
            });
      });
    }
  },

  insert(data, callBack) {
    const keys = ["category_id", "fields", "name"];
    const arr = [];
    keys.forEach((key) => {
      arr.push(data[key]);
    });
    const query = `INSERT INTO ${this.table} (${keys.toString()})
                       VALUES (?, ?, ?)`;
    db.query(query, arr, (err, res) => {
      if (err) console.log(err);
      else {
        res ? callBack(res) : callBack(false);
      }
    });
  },

  get(req, res) {
    const id = req.param("id");

    if (id) {
      const query = `SELECT *
                           FROM ${this.table}
                           WHERE id = ${id}`;
      db.query(query, (err, results) => {
        if (err) res.send(err);
        else res.send(results);
      });
    } else {
      const query = `SELECT *
                           FROM ${this.table}`;
      db.query(query, (err, results) => {
        if (err) res.send(err);
        else res.send(results);
      });
    }
  },

  update(req, res) {
    const keys = Object.keys(req.body);
    const arr = [];
    let user = [];

    keys.forEach((key) => {
      arr.push(req.body[key]);
    });

    keys.forEach((key) => {
      let obj = {};
      obj[key] = req.body[key];
      user.push(obj);
    });

    user = Object.assign({}, ...user);

    const v = new validator();
    const validateResponse = v.validate(user, this.schema);

    if (validateResponse && validateResponse.length > 0) {
      res.send(validateResponse);
    } else {
      validate.uniqueName(
        req.body.name,
        (r) => {
          r
            ? res.send("This name has already been taken")
            : update(req.body, (r) => {
                r ? res.send("done") : res.send("Something went wrong");
              });
        },
        req.body.id
      );
    }

    const update = (data, callBack) => {
      const query = `UPDATE ${this.table}
                           SET category_id=${data.category_id},
                               fields='${data.fields}',
                               name='${data.name}'
                           WHERE id = ${data.id}`;
      db.query(query, (err, res) => {
        if (err) console.log(err);
        else res ? callBack(true) : callBack(false);
      });
    };
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

export default Category;
