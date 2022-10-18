import validator from "fastest-validator";
import fs from "fs";
import path from "path";
import db from "../config/DB.js";

const Category = {
  table: "banner",

  schema: {
    icon: { type: "string", optional: "false" },
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
    const keys = ["name", "icon", "cat_order"];
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

  iconUpload(req, res) {
    const tmp_path = req.file.path;
    const target_path = "uploads/banner/icons/" + req.file.originalname;
    const src = fs.createReadStream(tmp_path);
    const dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on("end", function () {
      const fileName =
        new Date().getTime() + path.extname(req.file.originalname);
      fs.renameSync(
        "uploads/banner/icons/" + req.file.originalname,
        "uploads/banner/icons/" + fileName
      );
      res.send(fileName);
    });
    src.on("error", function (err) {
      res.send("error");
    });
  },
};

export default Category;
