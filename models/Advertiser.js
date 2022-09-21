import db from '../config/DB.js'
import validate from '../request/AdvertiserUdateRequest.js'
import status from "../helpers/status.js"

const Advertiser = {
    table: "advertisers",

    insert(userId, data, callBack) {
        const keys = ["user_id", "location_id", "email"]
        const arr = []
        keys.forEach(key => {
            if (key === "user_id") data[key] = userId
            arr.push(data[key])
        })
        const query = `INSERT INTO ${this.table} (${keys.toString()})
                       VALUES (?, ?, ?)`

        db.query(query, arr, (err, res) => {
            if (err) console.log(err)
            else callBack(res.insertId)
        })
    },

    get(req, res) {
        const id = req.param('id')
        if (id) {
            const query = `SELECT ${this.table}.*, users.name
                           FROM ${this.table}
                                    LEFT JOIN users
                                              ON ${this.table}.user_id = users.id
                           WHERE ${this.table}.id = ${id}`
            db.query(query, (err, result) => {
                if (err) console.log(err)
                else res.send({data: result})
            })
        } else {
            const query = `SELECT ${this.table}.*, users.name
                           FROM ${this.table}
                                    LEFT JOIN users
                                              ON ${this.table}.user_id = users.id`
            db.query(query, (err, result) => {
                if (err) console.log(err)
                else res.send({data: result})
            })
        }
    },

    update(req, res) {
        const email = req.body.email
        const id = req.body.id

        if (!id) res.send("id is required!")

        const update = (callBack) => {
            const query = `UPDATE ${this.table}
                           SET email='${email}',
                               website = '${req.body.website}',
                               logo = '${req.body.logo}'
                           WHERE id = ${id}`
            db.query(query, (err, result) => {
                if (err) console.log(err)
                else callBack(true)
            })
        }

        if (email) validate.uniqueEmail(email, id, (r) => {
            r ? res.send("This email has already been taken") : update((r) => {
                r ? res.send("updated") : res.send("Something went wrong")
            })
        })
        else {
            update((r) => {
                r ? res.send("updated") : res.send("Something went wrong")
            })
        }
    },

    block(req, res) {
        const id = req.param('id')
        status.block(id, this.table, (r) => {
            r ? res.send("blocked") : res.send("something went wrong")
        })
    },

    active(req, res) {
        const id = req.param('id')
        status.active(id, this.table, (r) => {
            r ? res.send("activated") : res.send("something went wrong")
        })
    },

    premium(req, res) {
        const id = req.param('id')
        const query = `UPDATE ${this.table}
                       SET type=1
                       WHERE id = ${id}`
        db.query(query, (err, result) => {
            if (err) console.log(err)
            else res.send({status: "updated"})
        })
    },

    normalUser(req, res) {
        const id = req.param('id')
        const query = `UPDATE ${this.table}
                       SET type=0
                       WHERE id = ${id}`
        db.query(query, (err, result) => {
            if (err) console.log(err)
            else res.send({status: "updated"})
        })
    },

    total: {
        table: "advertisers",
        normal(req, res) {
            const query = `SELECT count(id) as total
                           FROM ${this.table}`
            db.query(query, (err, result) => {
                if (err) console.log(err)
                else res.send({total: result[0].total})
            })
        },

        premium(req, res) {
            const query = `SELECT count(id) as total
                           FROM ${this.table}
                           WHERE type = 1`
            db.query(query, (err, result) => {
                if (err) console.log(err)
                else res.send({total: result[0].total})
            })
        }
    },
}

export default Advertiser