import Validator from "fastest-validator";
import convert from "./convert.js";
import db from "../config/DB.js";

const validate = {
    errors: [],
    fieldRequired(data, schema, callBack) {
        const v = new Validator()
        const response = v.validate(data, schema)
        callBack(response)
    },

    all(data, table, callBack) {
        const keys = Object.keys(data)
        const arr = []
        keys.forEach(key => {
            if (data[key] === "") arr[key] = `${key} is required`
            else if (data[key] && key === "email") !this.email(data[key]) ? arr[key] = `${key} is not valid` : delete arr[key]
            else if (data[key] && key === "con_password") !this.matchPassword(data.password, data.con_password) ? arr[key] = `password doesn't match` : delete arr[key]
        })
        this.errors = arr
        Object.keys(this.errors).length > 0 ? callBack(convert.body(this.errors)) : callBack(false)
    },

    email(email) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true
        }
        return false
    },

    matchPassword(password, conPassword) {
        if (password === conPassword) return true
        return false
    },

    unique(column, table, value, callBack, id = false) {
        const query = id ? `SELECT ${column}
                            FROM ${table}
                            WHERE ${column} = '${value}'
                              AND id != ${id}` : `SELECT ${column}
                                                  FROM ${table}
                                                  WHERE ${column} = '${value}'`
        db.query(query, (err, res) => {
            err ? console.log(err) : res.length > 0 ? callBack(true) : callBack(false)
        })
    }
}

export default validate