import db from "../config/DB.js";
import validate from "../helpers/validate.js";
import District from "./District.js";
import Province from "./Province.js";

const City = {
    table: "cities",

    schema: {
        name: {type: "string", optional: "false"},
        district_id: {type: "integer", optional: "false"}
    },

    create(req, res) {
        const city = req.body
        validate.unique("name", City.table, city.name, (response) => {
            !response
                ? City.insert(city, (response) => {
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
        const query = `INSERT INTO ${City.table} (${keys.toString()})
                       VALUES (?, ?)`;
        db.query(query, arr, (err, result) => {
            if (err) console.log(err)
            else {
                const id = result.insertId
                const query = `SELECT ${City.table}.*, ${District.table}.name AS 'district', ${Province.table}.name AS 'province'
                               FROM ${City.table}
                                        JOIN ${District.table} ON ${City.table}.district_id = ${District.table}.id
                                        JOIN ${Province.table} ON ${District.table}.province_id = ${Province.table}.id
                               WHERE ${City.table}.id = ${id}`
                db.query(query, (err, results) => {
                    if (err) console.log(err)
                    else callBack(results)
                })
            }
        });
    },

    get: {
        all(req, res) {
            const query = `SELECT ${City.table}.*, ${District.table}.name AS 'district', ${Province.table}.name AS 'province'
                           FROM ${City.table}
                                    JOIN ${District.table} ON ${City.table}.district_id = ${District.table}.id
                                    JOIN ${Province.table} ON ${District.table}.province_id = ${Province.table}.id`
            db.query(query, (err, cities) => {
                if (err) console.log(err)
                else res.send({results: cities})
            })
        },

        one(req, res) {
            const id = req.params.id
            const query = `SELECT ${City.table}.*, ${District.table}.name AS 'district', ${Province.table}.name AS 'province'
                           FROM ${City.table}
                                    JOIN ${District.table} ON ${City.table}.district_id = ${District.table}.id
                                    JOIN ${Province.table} ON ${District.table}.province_id = ${Province.table}.id
                           WHERE ${City.table}.id = ${id}`
            db.query(query, (err, cities) => {
                if (err) console.log(err)
                else res.send({results: cities})
            })
        },
    },

    patch(req, res) {
        const city = req.body
        req.file !== undefined ? validate.unique('name', City.table, city.name, (response) => {
            !response ? City.update((city), (response) => {
                response ? res.status(200).send({message: "success"}) : res.status(500).send({message: "Error, something went wrong"})
            }) : res.status(500).send({message: "this name has already been taken"})
        }, req.body.id) : validate.unique('name', City.table, city.name, (response) => {
            !response ? City.update((city), (response) => {
                response ? res.status(200).send({message: "success"}) : res.status(500).send({message: "Error, something went wrong"})
            }) : res.status(500).send({message: "this name has already been taken"})
        }, req.body.id)
    },

    update(data, callBack) {
        const query = `UPDATE ${City.table}
                       SET name = '${data.name}'
                       WHERE id = ${data.id}`
        db.query(query, (err, update) => {
            if (err) console.log(err)
            update.affectedRows === 1 ? callBack(true) : callBack(false)
        })
    },

};

export default City;
