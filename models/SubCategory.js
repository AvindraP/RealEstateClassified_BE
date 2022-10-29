import convert from "../helpers/convert.js";
import validate from "../helpers/validate.js";
import db from "../config/DB.js";

const SubCategory = {
    table: "sub_categories",

    schema: {
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
                       VALUES (?, ?)`;
        db.query(query, arr, (err, result) => {
            err
                ? console.log(err)
                : result
                ? callBack(result.insertId)
                : callBack(false);
        });
    },

    changeStatus(req, res) {
        const id = req.body.id
        const status = req.body.status

        const query = `UPDATE ${SubCategory.table}
                       SET is_active = ${status}
                       WHERE id = ${id}`
        db.query(query, (err, response) => res.send({message: "Updated"}))
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

    patch(req, res) {
        const category = req.body;
        const id = category.id;
        const query = `UPDATE ${SubCategory.table}
                       SET name = '${category.name}'
                       WHERE id = ${id}`;
        db.query(query, (err, response) => {
            if (err) console.log(err);
            else res.send({message: "Success"})
        });
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
