import db from '../config/DB.js'

const TempDetail = {
    table: "temp_details",

    insert(data, id, callBack) {
        const keys = Object.keys(data)
        keys.push('otp_id')
        const arr = []
        keys.forEach(key => {
            if (key === 'otp_id') data[key] = id
            arr.push(data[key])
        })

        const query = `INSERT INTO ${this.table} (${keys.toString()})
                       VALUES (?, ?, ?, ?)`
        db.query(query, arr, (err, res) => {
            if (err) console.log(err)
            res ? callBack(true) : callBack(false)
        })
    },

    get(id, callBack) {
        const query = `SELECT *
                       FROM ${this.table}
                       WHERE id = ${id}`
        db.query(query, (err, res) => {
            if (err) new Error(err)
            else callBack(res)
        })
    },

    remove(id, callBack) {
        const query = `DELETE
                       FROM ${this.table}
                       WHERE otp_id = ${id}`
        db.query(query, (err, res) => {
            if (err) console.log(err)
            else {
                res ? callBack(true) : callBack(false)
            }
        })
    },

    uniqueName(name, callBack) {
        const query = `SELECT name
                       FROM ${this.table}
                       WHERE name = '${name}'`
        db.query(query, (err, res) => {
            if (err) console.log(err)
            else {
                res.length > 0 ? callBack(true) : callBack(false)
            }
        })
    }
}

export default TempDetail