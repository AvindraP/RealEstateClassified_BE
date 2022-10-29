import convert from "../helpers/convert.js";
import validate from "../helpers/validate.js";
import db from "../config/DB.js";

const SubCategory = {
    table: "sub_categories",

    schema: {
        category_id: {type: "number", optional: "false"},
        name: {type: "string", optional: "false"},
    },

    create(req, res) {
        const subCategory = convert.body(req.body)
        validate.fieldRequired(subCategory, SubCategory.schema, (response) => {
            response && response.length > 0
                ? res.send(response)
                : validate.all(subCategory, SubCategory.table, (response) => {
                    response
                        ? res.send(response)
                        : validate.unique(
                        "name",
                        SubCategory.table,
                        req.body.name,
                        (response) => {
                            response
                                ? res
                                    .status(500)
                                    .send({
                                        message: `this name has already been taken`,
                                    })
                                : SubCategory.insert(subCategory, (response) =>
                                    response
                                        ? res.send({message: "success"})
                                        : res
                                            .status(500)
                                            .send({message: "something went wrong"})
                                );
                        }
                        );
                });
        })
    },

    insert(data, callBack) {
        const keys = Object.keys(data);
        const arr = [];
        keys.forEach((key) => {
            arr.push(data[key]);
        });
        const query = `INSERT INTO ${SubCategory.table} (${keys.toString()})
                       VALUES (?, ?, ?)`;
        db.query(query, arr, (err, result) => {
            err
                ? console.log(err)
                : result
                ? callBack(result.insertId)
                : callBack(false);
        });
    },

    get: {
        all(req, res) {
            const query = `SELECT *
                           FROM ${SubCategory.table}`;
            db.query(query, (err, results) => {
                err
                    ? res.status(500).send(err)
                    : results.length > 0
                    ? res.send({results})
                    : res.send({results: []});
            });
        },

        one(req, res) {
            const id = req.params.id;
            const query = `SELECT *
                           FROM ${SubCategory.table}
                           WHERE id = ${id}`;

            db.query(query, (err, results) => {
                err
                    ? res.status(500).send(err)
                    : results.length > 0
                    ? res.send({results})
                    : res.send({results: []});
            });
        },
    },

    delete(req, res) {
        const id = req.body.id;
        const query = `DELETE
                       FROM ${SubCategory.table}
                       WHERE id = ${id}`;
        db.query(query, (err, results) => {
            if (err) console.log(err);
            results
                ? res.send({message: "success"})
                : res.status(500).send({message: "Something went wrong!"});
        });
    },
};

export default SubCategory;
