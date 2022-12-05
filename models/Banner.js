import db from "../config/DB.js";
import validate from "../helpers/validate.js";

const Banner = {
  table: "banner",

  schema: {
    title: { type: "string", optional: "false" },
    location: { type: "string", optional: "false" },
    image: { type: "string", optional: "false" },
  },

  create(req, res) {
    const banner = req.body;
    validate.unique("title", Banner.table, banner.title, (response) => {
      !response
        ? Banner.insert(banner, (response) => {
            response
              ? res.status(200).send({ message: "success", results: response })
              : res
                  .status(500)
                  .send({ message: "Error, something went wrong" });
          })
        : res.status(500).send({ message: "this name has already been taken" });
    });
  },

  insert(data, callBack) {
    let keys = Object.keys(data);
    const arr = [];
    keys.forEach((key) => {
      arr.push(data[key]);
    });
    const query = `INSERT INTO ${Banner.table} (${keys.toString()})
                       VALUES (?)`;
    db.query(query, arr, (err, result) => {
      if (err) console.log(err);
      else {
        const id = result.insertId;
        const query = `SELECT *
                               FROM ${Banner.table}
                               WHERE id = ${id}`;
        db.query(query, (err, results) => {
          if (err) console.log(err);
          else callBack(results);
        });
      }
    });
  },

  get: {
    all(req, res) {
      const query = `SELECT *
                           FROM ${Banner.table}`;
      db.query(query, (err, banners) => {
        if (err) console.log(err);
        else res.send({ results: banners });
      });
    },

    one(req, res) {
      const id = req.params.id;
      const query = `SELECT *
                           FROM ${Banner.table}
                           WHERE id = ${id}`;
      db.query(query, (err, banners) => {
        if (err) console.log(err);
        else res.send({ results: banners });
      });
    },
  },

  patch(req, res) {
    const banner = req.body;
    req.file !== undefined
      ? validate.unique(
          "title",
          Banner.table,
          banner.title,
          (response) => {
            !response
              ? Banner.update(banner, (response) => {
                  response
                    ? res.status(200).send({ message: "success" })
                    : res
                        .status(500)
                        .send({ message: "Error, something went wrong" });
                })
              : res
                  .status(500)
                  .send({ message: "this name has already been taken" });
          },
          req.body.id
        )
      : validate.unique(
          "name",
          Banner.table,
          banner.name,
          (response) => {
            !response
              ? Banner.update(banner, (response) => {
                  response
                    ? res.status(200).send({ message: "success" })
                    : res
                        .status(500)
                        .send({ message: "Error, something went wrong" });
                })
              : res
                  .status(500)
                  .send({ message: "this name has already been taken" });
          },
          req.body.id
        );
  },

  update(data, callBack) {
    const query = `UPDATE ${Banner.table}
                       SET name = '${data.name}'
                       WHERE id = ${data.id}`;
    db.query(query, (err, update) => {
      if (err) console.log(err);
      update.affectedRows === 1 ? callBack(true) : callBack(false);
    });
  },
};

export default Banner;
