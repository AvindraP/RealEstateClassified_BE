import validator from 'fastest-validator'
import validate from '../request/CityPostRequest.js'
import db from '../config/DB.js'

const City = {
    table: "cities",
    schema: {
        name: {type: "string", optional: "false"},
    },

    insert(req, res) {
        const keys = Object.keys(req.body)
        const arr = []
        let add = []

        keys.forEach(key => {

            arr.push(req.body[key])
        })

        keys.forEach(key => {
            let obj = {}
            obj[key] = req.body[key]
            add.push(obj)
        })

        add = Object.assign({}, ...add)

        const v = new validator()
        const validateResponse = v.validate(add, this.schema)

        if (validateResponse && validateResponse.length > 0) {
            res.send(validateResponse)
        } else {
            validate.uniqueName(req.body.name, (r) => {
                r ? res.send("This name has already been taken") : insert(req.body, (r) => {
                    r ? res.send("added") : res.send(r)
                })
            })
        }

        const insert = (data, callBack) => {
            keys.forEach(key => {
                arr.push(data[key])
            })
            const query = `INSERT INTO ${this.table} (${keys.toString()})
                           VALUES (?)`
            db.query(query, arr, (err, result) => {
                if (err) console.log(err)
                else {
                    result ? callBack(true) : callBack(false)
                }
            })
        }

    },

    get(req, res) {
        const id = req.param('id')

        if (id) {
            const query = `SELECT *
                           FROM ${this.table}
                           WHERE id = ${id}`
            db.query(query, (err, results) => {
                if (err) res.send(err)
                else res.send(results)
            })
        } else {
            const query = `SELECT *
                           FROM ${this.table}
            `
            db.query(query, (err, results) => {
                if (err) res.send(err)
                else res.send(results)
            })
        }
    },

    update(req, res) {
        const keys = Object.keys(req.body)
        let city = []

        keys.forEach(key => {
            let obj = {}
            obj[key] = req.body[key]
            city.push(obj)
        })

        city = Object.assign({}, ...city)

        const v = new validator()
        const validateResponse = v.validate(city, this.schema)

        if (validateResponse && validateResponse.length > 0) {
            res.send(validateResponse)
        } else {
            validate.uniqueName(req.body.name, (r) => {
                r ? res.send("This name has already been taken") : update(req.body, (r) => {
                    r ? res.send("updated") : res.send(r)
                })
            }, req.body.id)

            const update = (data, callBack) => {
                const query = `UPDATE ${this.table}
                               SET name='${data.name}'
                               WHERE id = ${data.id}`
                db.query(query, (err, result) => {
                    console.log(result)
                    if (err) console.log(err)
                    else callBack(result)
                })
            }
        }
    }
}

export default City