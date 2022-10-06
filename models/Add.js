import validator from "fastest-validator";
import db from "../config/DB.js";

/*
 * status
 * 0 : block
 * 1 : active
 * 2 : pending
 * 3 : posted
 * 4 : sold
 * */

const Add = {
  table: "adds",
  schema: {
    sub_category_id: { type: "number", optional: "false" },
    advertiser_id: { type: "number", optional: "false" },
    title: { type: "string", optional: "false" },
    price: { type: "number", optional: "false" },
    description: { type: "string", optional: "false" },
    field_desc: { type: "string", optional: "false" },
    icons: { type: "string", optional: "false" },
  },

  insert(req, res) {
    const keys = Object.keys(req.body);
    const arr = [];
    let add = [];
    keys.push("created_at");

    keys.forEach((key) => {
      if (key === "created_at") req.body[key] = new Date();
      arr.push(req.body[key]);
    });

    keys.forEach((key) => {
      let obj = {};
      obj[key] = req.body[key];
      add.push(obj);
    });

    add = Object.assign({}, ...add);

    const v = new validator();
    const validateResponse = v.validate(add, this.schema);

    if (validateResponse && validateResponse.length > 0) {
      res.send(validateResponse);
    } else {
      keys.forEach((key) => {
        arr.push(req.body[key]);
      });
      const query = `INSERT INTO ${this.table} (${keys.toString()})
                           VALUES (?, ?, ?, ?, ?, ?)`;
      db.query(query, arr, (err, result) => {
        if (err) console.log(err);
        else {
          result ? res.send("Added") : res.send("Something went wrong");
        }
      });
    }
  },

  get(req, res) {
    const id = req.param("id");

    if (id) {
      const query = `SELECT *
                           FROM ${this.table}
                           WHERE id = ${id}`;
      db.query(query, (err, results) => {
        if (err) console.log(err);
        else res.send(results);
      });
    } else {
      const query = `SELECT *
                           FROM ${this.table}`;
      db.query(query, (err, results) => {
        if (err) console.log(err);
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
      const query = `UPDATE ${this.table}
                           SET sub_category_id='${req.body.sub_category_id}',
                               title='${req.body.title}',
                               description='${req.body.description}',
                               field_desc='${req.body.field_desc}',
                               icons='${req.body.icons}'
                           WHERE id = ${req.body.id}`;
      db.query(query, (err, results) => {
        if (err) console.log(err);
        else results ? res.send("done") : res.send("Something went wrong");
      });
    }
  },

  top(req, res) {
    const id = req.param("id");
    const query = `UPDATE ${this.table}
                       SET is_top=1
                       WHERE id = ${id}`;
    db.query(query, (err, results) => {
      if (err) console.log(err);
      else res.send("Top");
    });
  },

  removeTop(req, res) {
    const id = req.param("id");
    const query = `UPDATE ${this.table}
                       SET is_top=0
                       WHERE id = ${id}`;
    db.query(query, (err, results) => {
      if (err) console.log(err);
      else res.send("Top remove");
    });
  },

  sold(req, res) {
    const id = req.param("id");
    const query = `UPDATE ${this.table}
                       SET status=1
                       WHERE id = ${id}`;
    db.query(query, (err, results) => {
      if (err) console.log(err);
      else res.send("sold out");
    });
  },

  remove(req, res) {
    const id = req.param("id");
    const query = `DELETE
                       FROM ${this.table}
                       WHERE id = ${id}`;
    db.query(query, (err, results) => {
      if (err) console.log(err);
      else res.send("Deleted");
    });
  },

  total: {
    table: "adds",
    all(req, res) {
      const query = `SELECT count(id) as total
                           FROM ${this.table}`;
      db.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ total: result[0].total });
      });
    },

    active(req, res) {
      const query = `SELECT count(id) as total
                           FROM ${this.table}
                           WHERE status = 1`;
      db.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ total: result[0].total });
      });
    },

    pending(req, res) {
      const query = `SELECT count(id) as total
                           FROM ${this.table}
                           WHERE status = 2`;
      db.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ total: result[0].total });
      });
    },
  },

  publish(req, res) {
    const id = req.param("id");

    const query = `UPDATE ${this.table}
                       SET status=3,
                           published_at=current_timestamp
                       WHERE id = ${id}`;

    db.query(query, (err, result) => {
      if (err) console.log(err);
      else res.send({ status: "posted" });
    });
  },

  lastSevenDays: {
    table: "adds",
    post(req, res) {
      const query = `SELECT count(id) as total
                           FROM ${this.table}
                           WHERE published_at >= DATE (NOW() - INTERVAL 7 DAY)`;
      db.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ data: result[0].total });
      });
    },

    sold(req, res) {
      const query = `SELECT count(id) as total
                           FROM ${this.table}
                           WHERE status = 4
                             AND published_at >= DATE (NOW() - INTERVAL 7 DAY)`;
      db.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ data: result[0].total });
      });
    },
  },

  lastOneDay: {
    table: "adds",
    post(req, res) {
      const query = `SELECT count(id) as total
                           FROM ${this.table}
                           WHERE published_at >= DATE (NOW())`;
      db.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ data: result[0].total });
      });
    },

    sold(req, res) {
      const query = `SELECT count(id) as total
                           FROM ${this.table}
                           WHERE status = 4
                             AND published_at >= DATE (NOW())`;
      db.query(query, (err, result) => {
        if (err) console.log(err);
        else res.send({ data: result[0].total });
      });
    },
  },
};

export default Add;
