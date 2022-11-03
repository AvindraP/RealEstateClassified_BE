import db from "../config/DB.js";
import validate from "../helpers/validate.js";
import Province from "./Province.js";

const District = {
    table: "districts",

    schema: {
        name: {type: "string", optional: "false"},
        province_id: {type: "integer", optional: "false"}
    },

    create(req, res) {
        const district = req.body
        validate.unique("name", District.table, district.name, (response) => {
            !response
                ? District.insert(district, (response) => {
                    response
                        ? res.status(200).send({message: "success", results: response})
                        : res
                            .status(500)
                            .send({message: "Error, something went wrong"});
                })
                : res.status(500).send({message: "this name has already been taken"});
        });
    },

    insert(data, callBack) {
        let keys = Object.keys(data);
        const arr = [];
        keys.forEach((key) => {
            arr.push(data[key]);
        });
        const query = `INSERT INTO ${District.table} (${keys.toString()})
                       VALUES (?, ?)`;
        db.query(query, arr, (err, result) => {
            if (err) console.log(err)
            else {
                const id = result.insertId
                const query = `SELECT ${District.table}.*, ${Province.table}.name AS 'province'
                               FROM ${District.table}
                                        JOIN ${Province.table} ON ${District.table}.province_id = ${Province.table}.id
                               WHERE ${District.table}.id = ${id}`
                db.query(query, (err, results) => {
                    if (err) console.log(err)
                    else callBack(results)
                })
            }
        });
    },

    get: {
        all(req, res) {
            const query = `SELECT ${District.table}.*, ${Province.table}.name AS 'province'
                           FROM ${District.table}
                                    JOIN ${Province.table} ON ${District.table}.province_id = ${Province.table}.id`
            db.query(query, (err, districts) => {
                if (err) console.log(err)
                else res.send({results: districts})
            })
        },

        one(req, res) {
            const id = req.params.id
            const query = `SELECT ${District.table}.*, ${Province.table}.name AS 'province'
                           FROM ${District.table}
                                    JOIN ${Province.table} ON ${District.table}.province_id = ${Province.table}.id
                           WHERE ${District.table}.id = ${id}`
            db.query(query, (err, districts) => {
                if (err) console.log(err)
                else res.send({results: districts})
            })
        },
    },

    patch(req, res) {
        const district = req.body
        req.file !== undefined ? validate.unique('name', District.table, district.name, (response) => {
            !response ? District.update((district), (response) => {
                response ? res.status(200).send({message: "success"}) : res.status(500).send({message: "Error, something went wrong"})
            }) : res.status(500).send({message: "this name has already been taken"})
        }, req.body.id) : validate.unique('name', District.table, district.name, (response) => {
            !response ? District.update((district), (response) => {
                response ? res.status(200).send({message: "success"}) : res.status(500).send({message: "Error, something went wrong"})
            }) : res.status(500).send({message: "this name has already been taken"})
        }, req.body.id)
    },

    update(data, callBack) {
        const query = `UPDATE ${District.table}
                       SET name = '${data.name}'
                       WHERE id = ${data.id}`
        db.query(query, (err, update) => {
            if (err) console.log(err)
            update.affectedRows === 1 ? callBack(true) : callBack(false)
        })
    },

};

export default District;
