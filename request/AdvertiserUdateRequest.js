import db from '../config/DB.js'

const validate = {
    table: "advertisers",

    uniqueEmail(email, id, callBack) {
        const query = `SELECT email
                       FROM ${this.table}
                       WHERE email = '${email}'
                         AND id != ${id}`
        db.query(query, (err, result) => {
            if (err) console.log(err)
            else {
                result.length > 0 ? callBack(true) : callBack(false)
            }
        })
    }
}

export default validate