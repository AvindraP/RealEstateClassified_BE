import db from '../config/DB.js'

const validate = {
    table: 'countries',

    uniqueName(name, callBack, id) {
        if (!id) {
            const query = `SELECT name
                           FROM ${this.table}
                           WHERE name = '${name}'`
            db.query(query, (err, res) => {
                if (err) callBack(err)
                else res.length > 0 ? callBack(true) : callBack(false)
            })
        } else {
            const query = `SELECT name
                           FROM ${this.table}
                           WHERE name = '${name}'
                             AND id != ${id}`
            db.query(query, (err, res) => {
                if (err) callBack(err)
                else res.length > 0 ? callBack(true) : callBack(false)
            })
        }
    }
}

export default validate