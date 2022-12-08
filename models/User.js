import convert from "../helpers/convert.js";
import validate from "../helpers/validate.js";
import db from "../config/DB.js";
import bcrypt from "bcrypt";

const User = {
  table: "users",
  schema: {
    name: { type: "string", optional: "false" },
    phone: { type: "string", optional: "false" },
    password: { type: "string", optional: "false" },
    con_password: { type: "string", optional: "false" },
  },

  create(req, res) {
    const user = convert.body(req.body);
    validate.fieldRequired(user, User.schema, (response) => {
      response && response.length > 0
        ? res.send(response)
        : validate.all(user, User.table, (response) => {
            response
              ? res.send(response)
              : validate.unique(
                  "name",
                  User.table,
                  req.body.name,
                  (response) => {
                    response
                      ? res.status(500).send({
                          message: `this name has already been taken`,
                        })
                      : User.insert(user, (response) =>
                          response
                            ? res.send({ message: "success" })
                            : res
                                .status(500)
                                .send({ message: "something went wrong" })
                        );
                  }
                );
          });
    });
  },

  insert(data, callBack) {
    delete data.stadium_id;
    delete data.id;
    delete data.user_id;
    delete data.stadium;
    delete data.name;
    const keys = Object.keys(data);
    const arr = [];
    keys.splice(keys.indexOf("con_password"), 1);
    keys.forEach((key) => {
      if (key === "password") data[key] = bcrypt.hashSync(data[key], 12);
      arr.push(data[key]);
    });
    const query = `INSERT INTO ${User.table} (${keys.toString()})
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, arr, (err, result) => {
      err
        ? console.log(err)
        : result
        ? callBack(result.insertId)
        : callBack(false);
    });
  },

  update(data, id, callBack) {
    const name = data.name;
    validate.unique(
      "name",
      User.table,
      name,
      (response) => {
        !response
          ? User.patch(data, id, (response) => {
              response ? callBack(true) : callBack(false);
            })
          : callBack(false);
      },
      id
    );
  },

  patch(data, id, callBack) {
    const query = `UPDATE ${User.table}
                       SET name    = '${data.name}',
                           phone   = '${data.phone}',
                           password = '${bcrypt.hashSync(data.password, 12)}'
                       WHERE id = ${id}`;
    db.query(query, (err, response) => {
      if (err) console.log(err);
      response ? callBack(true) : callBack(false);
    });
  },
};

export default User;
