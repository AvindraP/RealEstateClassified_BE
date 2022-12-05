import validate from "../helpers/validate.js";
import bcrypt from "bcrypt";
import db from "../config/DB.js";
import jwt from "jsonwebtoken";

const Auth = {
  table: "users",
  schema: {
    phone: { type: "string", optional: "false" },
    password: { type: "string", optional: "false" },
  },

  login(req, res) {
    const user = req.body;
    validate.fieldRequired(user, Auth.schema, (response) => {
      response && response.length > 0
        ? res.send(response)
        : validate.all(user, Auth.table, (response) => {
            !response
              ? Auth.authenticate(user, req, (response) => {
                  !response
                    ? res.status(401).send({ message: "Invalid credentials" })
                    : Auth.setToken(
                        response[0].id,
                        response[0].type,
                        (token) => {
                          req.session.userId = response[0].id;
                          res.send({ auth: true, token, data: response });
                        }
                      );
                })
              : res.send(response);
          });
    });
  },

  authenticate(user, req, callBack) {
    const query = `SELECT id, phone, password, type
                       FROM ${Auth.table}
                       WHERE phone = '${user.phone}'`;

    db.query(query, (err, res) => {
      err
        ? console.log(err)
        : res.length > 0
        ? bcrypt.compare(user.password, res[0].password, (err, response) => {
            err ? console.log(err) : response ? callBack(res) : callBack(false);
          })
        : callBack(false);
    });
  },

  setToken(id, type, callBack) {
    const token = jwt.sign({ id, type }, "jwtSecret", {
      expiresIn: "3h",
    });
    callBack(token);
  },

  readToken(token) {
    return jwt.decode(token);
  },
};

export default Auth;
