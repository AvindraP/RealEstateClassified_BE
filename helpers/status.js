import db from '../config/DB.js'

const status = {
    block(id, table, callBack) {
        const query = `UPDATE ${table}
                       SET is_active=0
                       WHERE id = ${id}`
        db.query(query, (err, result) => {
            if (err) console.log(err)
            else result ? callBack(true) : callBack(false)
        })
    },

    active(id, table, callBack) {
        const query = `UPDATE ${table}
                       SET is_active=1
                       WHERE id = ${id}`
        db.query(query, (err, result) => {
            if (err) console.log(err)
            else result ? callBack(true) : callBack(false)
        })
    }
}

export default status