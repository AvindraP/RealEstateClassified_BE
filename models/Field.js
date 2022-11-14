import db from "../config/DB.js";
import validate from "../helpers/validate.js";
import SubCategory from "./SubCategory.js";
import status from "../helpers/status.js";
import require from "../helpers/require.js";

const Field = {
    table: "fields",

    schema: {
        name: {type: "string", optional: "false"},
        sub_category_id: {type: "integer", optional: "false"}
    },

    create(req, res) {
        const field = req.body
        Field.insert(field, (response) => {
            response
                ? res.status(200).send({message: "success", results: response})
                : res
                    .status(500)
                    .send({message: "Error, something went wrong"});
        })
    },

    insert(data, callBack) {
        let keys = Object.keys(data);
        const arr = [];
        keys.forEach((key) => {
            arr.push(data[key]);
        });
        const query = `INSERT INTO ${Field.table} (${keys.toString()})
                       VALUES (?, ?, ?, ?)`;
        db.query(query, arr, (err, result) => {
            if (err) console.log(err)
            else {
                const id = result.insertId
                const query = `SELECT ${Field.table}.*, ${SubCategory.table}.name AS 'sub_category'
                               FROM ${Field.table}
                                        JOIN ${SubCategory.table} ON ${Field.table}.sub_category_id = ${SubCategory.table}.id
                               WHERE ${Field.table}.id = ${id}`
                db.query(query, (err, results) => {
                    if (err) console.log(err)
                    else callBack(results)
                })
            }
        });
    },

    get: {
        all(req, res) {
            const query = `SELECT ${Field.table}.*, ${SubCategory.table}.name AS 'sub_category'
                           FROM ${Field.table}
                                    JOIN ${SubCategory.table} ON ${Field.table}.sub_category_id = ${SubCategory.table}.id`
            db.query(query, (err, fields) => {
                if (err) console.log(err)
                else res.send({results: fields})
            })
        },

        one(req, res) {
            const id = req.params.id
            const query = `SELECT ${Field.table}.*, ${SubCategory.table}.name AS 'sub_category'
                           FROM ${Field.table}
                                    JOIN ${SubCategory.table} ON ${Field.table}.sub_category_id = ${SubCategory.table}.id
                           WHERE ${Field.table}.id = ${id}`
            db.query(query, (err, fields) => {
                if (err) console.log(err)
                else res.send({results: fields})
            })
        },

        subCategory(req, res) {
            const id = req.params.id
            const query = `SELECT *
                           FROM ${Field.table}
                           WHERE sub_category_id = ${id} AND is_active = 1`
            db.query(query, (err, fields) => {
                if (err) console.log(err)
                else res.send({results: fields})
            })
        },
    },

    patch(req, res) {
        const field = req.body
        req.file !== undefined ? validate.unique('name', Field.table, field.name, (response) => {
            !response ? Field.update((field), (response) => {
                response ? res.status(200).send({message: "success"}) : res.status(500).send({message: "Error, something went wrong"})
            }) : res.status(500).send({message: "this name has already been taken"})
        }, req.body.id) : validate.unique('name', Field.table, field.name, (response) => {
            !response ? Field.update((field), (response) => {
                response ? res.status(200).send({message: "success"}) : res.status(500).send({message: "Error, something went wrong"})
            }) : res.status(500).send({message: "this name has already been taken"})
        }, req.body.id)
    },

    update(data, callBack) {
        const query = `UPDATE ${Field.table}
                       SET name    = '${data.name}',
                           type    = '${data.type}',
                           options = '${data.options}'
                       WHERE id = ${data.id}`
        db.query(query, (err, update) => {
            if (err) console.log(err)
            update.affectedRows === 1 ? callBack(true) : callBack(false)
        })
    },

    status(req, res) {
        const id = req.params.id
        if (req.params.status === "true") status.active(id, Field.table, (response) => {
            res.send({message: "activated"})
        })
        else status.block(id, Field.table, (response) => {
            res.send({message: "blocked"})
        })
    },

    require(req, res) {
        const id = req.params.id
        if (req.params.status === "true") require.required(id, Field.table, (response) => {
            res.send({message: "required"})
        })
        else require.noRequired(id, Field.table, (response) => {
            res.send({message: "no required"})
        })
    }
};

export default Field;