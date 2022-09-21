import validator from 'fastest-validator'
import validate from '../request/CategoryPostRequset.js';
import fs from "fs"
import path from 'path'
import db from "../config/DB.js";
import status from '../helpers/status.js'

const Category = {
    table: "categories",

    schema: {
        name: {type: "string", optional: "false"},
        icon: {type: "string", optional: "false"},
        cat_order: {type: "number", optional: "false"},
    },

    create(req, res) {
        const keys = Object.keys(req.body)
        const arr = []
        let user = []

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
        const validateResponse = v.validate(user, this.schema)

        if (validateResponse && validateResponse.length > 0) {
            res.send(validateResponse)
        } else {
            validate.uniqueName(req.body.name, (r) => {
                r ? res.send("this name has been already taken") : this.insert(req.body, (r) => {
                    r ? res.send(`add ${r.insertId}`) : res.send("Something went wrong")
                })
            })
        }
    },

    insert(data, callBack) {
        const keys = ["name", "icon", "cat_order"]
        const arr = []
        keys.forEach(key => {
            arr.push(data[key])
        })
        const query = `INSERT INTO ${this.table} (${keys.toString()})
                       VALUES (?, ?, ?)`
        db.query(query, arr, (err, res) => {
            if (err) console.log(err)
            else {
                res ? callBack(res) : callBack(false)
            }
        })
    },

    iconUpload(req, res) {
        const tmp_path = req.file.path;
        const target_path = 'uploads/category/icons/' + req.file.originalname;
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function () {
            const fileName = new Date().getTime() + path.extname(req.file.originalname)
            fs.renameSync('uploads/category/icons/' + req.file.originalname, 'uploads/category/icons/' + fileName);
            res.send(fileName);
        });
        src.on('error', function (err) {
            res.send('error');
        });
    },

    get(req, res) {
        const id = req.param('id')

        if (id) {
            const query = `SELECT *
                           FROM ${this.table}
                           WHERE id = ${id}`
            db.query(query, (err, results) => {
                if (err) res.send(err)
                else res.send(results)
            })
        } else {
            const query = `SELECT *
                           FROM ${this.table}`
            db.query(query, (err, results) => {
                if (err) res.send(err)
                else res.send(results)
            })
        }
    },

    update(req, res) {
        const keys = Object.keys(req.body)
        const arr = []
        let user = []

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
        const validateResponse = v.validate(user, this.schema)

        if (validateResponse && validateResponse.length > 0) {
            res.send(validateResponse)
        } else {
            validate.uniqueName(req.body.name, (r) => {
                r ? res.send("This name has already been taken") : update(req.body, (r) => {
                    r ? res.send("done") : res.send("Something went wrong")
                })
            }, req.body.id)
        }

        const update = (data, callBack) => {
            const query = `UPDATE ${this.table}
                           SET name='${data.name}',
                               icon='${data.icon}',
                               cat_order=${data.cat_order}
                           WHERE id = ${data.id}`
            db.query(query, (err, res) => {
                if (err) callBack(err)
                else res ? callBack(true) : callBack(false)
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
    }
}

export default Category