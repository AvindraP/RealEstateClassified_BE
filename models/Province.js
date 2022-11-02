import db from "../config/DB.js";
import validate from "../helpers/validate.js";

const Province = {
    table: "provinces",

    schema: {
        name: {type: "string", optional: "false"},
    },

    create(req, res) {
        const province = req.body
        validate.unique("name", Province.table, province.name, (response) => {
            !response
                ? Province.insert(province, (response) => {
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
        const query = `INSERT INTO ${Province.table} (${keys.toString()})
                       VALUES (?)`;
        db.query(query, arr, (err, result) => {
            if (err) console.log(err)
            else {
                const id = result.insertId
                const query = `SELECT *
                               FROM ${Province.table}
                               WHERE id = ${id}`
                db.query(query, (err, results) => {
                    if (err) console.log(err)
                    else callBack(results)
                })
            }
        });
    },

    get: {
        all(req, res) {
            const query = `SELECT *
                           FROM ${Province.table}`
            db.query(query, (err, provinces) => {
                if (err) console.log(err)
                else res.send({results: provinces})
            })
        },

        one(req, res) {
            const id = req.params.id
            const query = `SELECT *
                           FROM ${Province.table}
                           WHERE id = ${id}`
            db.query(query, (err, provinces) => {
                if (err) console.log(err)
                else res.send({results: provinces})
            })
        },
    },

    patch(req, res) {
        const province = req.body
        req.file !== undefined ? validate.unique('name', Province.table, province.name, (response) => {
            !response ? Province.update((province), (response) => {
                response ? res.status(200).send({message: "success"}) : res.status(500).send({message: "Error, something went wrong"})
            }) : res.status(500).send({message: "this name has already been taken"})
        }, req.body.id) : validate.unique('name', Province.table, province.name, (response) => {
            !response ? Province.update((province), (response) => {
                response ? res.status(200).send({message: "success"}) : res.status(500).send({message: "Error, something went wrong"})
            }) : res.status(500).send({message: "this name has already been taken"})
        }, req.body.id)
    },

    update(data, callBack) {
        const query = `UPDATE ${Province.table}
                       SET name = '${data.name}',
                           WHERE id = ${data.id}`
        db.query(query, (err, update) => {
            if (err) console.log(err)
            update.affectedRows === 1 ? callBack(true) : callBack(false)
        })
    },

};

export default Province;
