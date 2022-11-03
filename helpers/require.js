import db from '../config/DB.js'

const require = {
    required(id, table, callBack) {
        const query = `UPDATE ${table}
                       SET is_required=1
                       WHERE id = ${id}`
        db.query(query, (err, result) => {
            if (err) console.log(err)
            else result ? callBack(true) : callBack(false)
        })
    },

    noRequired(id, table, callBack) {
        const query = `UPDATE ${table}
                       SET is_required=0
                       WHERE id = ${id}`
        db.query(query, (err, result) => {
            if (err) console.log(err)
            else result ? callBack(true) : callBack(false)
        })
    }
}

export default require