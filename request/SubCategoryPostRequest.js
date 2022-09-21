import db from '../config/DB.js'

const validate = {
    table: "sub_categories",

    uniqueName(name, callBack, id = false) {
        if(!id){
            const query = `SELECT name
                       FROM ${this.table}
                       WHERE name = '${name}'`

            db.query(query, (err, res) => {
                if (err) console.log(err)
                else {
                    res.length > 0 ? callBack(true) : callBack(false)
                }
            })
        } else {
            const query = `SELECT name
                       FROM ${this.table}
                       WHERE name = '${name}' AND id != ${id}`

            db.query(query, (err, res) => {
                if (err) console.log(err)
                else {
                    res.length > 0 ? callBack(true) : callBack(false)
                }
            })
        }
    },
}

export default validate