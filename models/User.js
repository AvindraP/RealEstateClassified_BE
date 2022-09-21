import validator from 'fastest-validator'
import validate from '../request/UserRegisterRequest.js'
import OTP from './OTP.js'
import TempDetail from './TempDetail.js'
import Admin from './Admin.js'
import Advertiser from './Advertiser.js'
import db from '../config/DB.js'

const User = {
    table: 'users',
    errors: [],
    error: false,
    success: false,

    create(req, res) {
        const keys = Object.keys(req.body)
        const arr = []
        let user = []
        const schema = {
            name: {type: "string", optional: "false"},
            password: {type: "string", optional: "false"},
        }

        keys.forEach(key => {
            arr.push(req.body[key])
        })

        keys.forEach(key => {
            let obj = {}
            obj[key] = req.body[key]
            user.push(obj)
        })

        user = Object.assign({}, ...user)

        const v = new validator()
        const validateResponse = v.validate(user, schema)

        if (validateResponse && validateResponse.length > 0) {
            res.send(validateResponse)
        } else {
            validate.uniqueName(req.body.name, (r) => {
                r ? res.send('This name has already been taken') : OTP.send(req.body.contact,
                    (r) => {
                        if (r) {
                            TempDetail.insert(req.body, r, (r) => {
                                r ? res.send("done") : res.send("something went wrong")
                            })
                        } else res.send("something went wrong")
                    }
                )
            })
        }
    },

    store(data, callBack) {
        const keys = ["name", "password", "contact", "role"]
        const arr = []
        keys.forEach(key => {
            arr.push(data[key])
        })
        const role = data.role
        const query = `INSERT INTO ${this.table} (${keys.toString()})
                       VALUES (?, ?, ?, ?)`
        db.query(query, arr, (err, res) => {
            if (err) console.log(err)
            else {
                // check user role
                role === 1 ? Admin.insert(res.insertId, data, callBack) : Advertiser.insert(res.insertId, data, callBack)
            }
        })
    }
}

export default User