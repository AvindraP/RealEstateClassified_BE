import db from '../config/DB.js'

const status = {
    block(id, table, column, callBack) {
        const query = `UPDATE ${table}
                       SET ${column}=0
                       WHERE id = ${id}`
        db.query(query, (err, result) => {
            if (err) console.log(err)
            else result ? callBack(true) : callBack(false)
        })
    },

    active(id, table, column, callBack) {
        const query = `UPDATE ${table}
                       SET ${column}=1
                       WHERE id = ${id}`
        db.query(query, (err, result) => {
            if (err) console.log(err)
            else result ? callBack(true) : callBack(false)
        })
    }
}

export default status