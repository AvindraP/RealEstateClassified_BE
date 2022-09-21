import db from "../config/DB.js";
import TempDetail from "../models/TempDetail.js";

const validate = {
  table: "users",

  uniqueName(name, callBack) {
    const query = `SELECT name
                       FROM ${this.table}
                       WHERE name = '${name}'`;
    db.query(query, (err, res) => {
      console.log(res.length);
      res?.length > 0 ? callBack(true) : TempDetail.uniqueName(name, callBack);
    });
  },
};

export default validate;
