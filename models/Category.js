import db from "../config/DB.js";
import validate from "../helpers/validate.js";
import Upload from "../helpers/upload.js";
import SubCategory from "./SubCategory.js";
import status from "../helpers/status.js";

const Category = {
    table: "categories",

    schema: {
        name: {type: "string", optional: "false"},
        image: {type: "string", optional: "false"},
        cat_order: {type: "number", optional: "false"},
        sub_categories: {type: "string", optional: "false"},
    },

    create(req, res) {
        const category = req.body
        validate.unique("name", Category.table, category.name, (response) => {
            !response
                ? Upload.image(req.file, (fileName) => {
                    const stadium = req.body;
                    category["image"] = "category-image/" + fileName;
                    Category.insert(stadium, (response) => {
                        response
                            ? res.status(200).send({message: "success", results: response})
                            : res
                                .status(500)
                                .send({message: "Error, something went wrong"});
                    });
                })
                : res.status(500).send({message: "this name has already been taken"});
        });
    },

    insert(data, callBack) {
        let keys = Object.keys(data);
        const arr = [];
        keys.forEach((key) => {
            arr.push(data[key]);
        });
        const query = `INSERT INTO ${Category.table} (${keys.toString()})
                       VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(query, arr, (err, result) => {
            if (err) console.log(err)
            else {
                const id = result.insertId
                const query = `SELECT *
                               FROM ${Category.table}
                               WHERE id = ${id}`
                db.query(query, (err, categories) => {
                    if (err) console.log(err)
                    else {
                        const query = `SELECT *
                                       FROM ${SubCategory.table}`
                        db.query(query, (err, subCategories) => {
                            categories.forEach(category => {
                                const subCategoryIds = category.sub_categories.split(",")
                                const arr = []
                                subCategoryIds.forEach(id => {
                                    const index = subCategories.findIndex(sCat => sCat.id === parseInt(id))
                                    index >= 0 && arr.push(subCategories[index])
                                })
                                category.sub_categories = arr
                            })
                            callBack(categories)
                        })
                    }
                })
            }
        });
    },

    get: {
        all(req, res) {
            const query = `SELECT *
                           FROM ${Category.table}
                           WHERE is_deleted = 0`
            db.query(query, (err, categories) => {
                if (err) console.log(err)
                else {
                    const query = `SELECT *
                                   FROM ${SubCategory.table}`
                    db.query(query, (err, subCategories) => {
                        categories.forEach(category => {
                            const subCategoryIds = category.sub_categories.split(",")
                            const arr = []
                            subCategoryIds.forEach(id => {
                                const index = subCategories.findIndex(sCat => sCat.id === parseInt(id))
                                index >= 0 && arr.push(subCategories[index])
                            })
                            category.sub_categories = arr
                        })
                        res.send({results: categories})
                    })
                }
            })
        },

        one(req, res) {
            const id = req.params.id
            const query = `SELECT *
                           FROM ${Category.table}
                           WHERE id = ${id}`
            db.query(query, (err, categories) => {
                if (err) console.log(err)
                else {
                    const query = `SELECT *
                                   FROM ${SubCategory.table}`
                    db.query(query, (err, subCategories) => {
                        categories.forEach(category => {
                            const subCategoryIds = category.sub_categories.split(",")
                            const arr = []
                            subCategoryIds.forEach(id => {
                                const index = subCategories.findIndex(sCat => sCat.id === parseInt(id))
                                index >= 0 && arr.push(subCategories[index])
                            })
                            category.sub_categories = arr
                        })
                        res.send({results: categories})
                    })
                }
            })
        },
    },

    patch(req, res) {
        const category = req.body
        req.file !== undefined ? validate.unique('name', Category.table, category.name, (response) => {
            !response ? Upload.image(req.file, (fileName) => {
                const category = req.body
                category['image'] = 'category-image/' + fileName
                Category.update((category), (response) => {
                    response ? res.status(200).send({message: "success"}) : res.status(500).send({message: "Error, something went wrong"})
                })
            }) : res.status(500).send({message: "this name has already been taken"})
        }, req.body.id) : validate.unique('name', Category.table, category.name, (response) => {
            !response ? Category.update((category), (response) => {
                response ? res.status(200).send({message: "success"}) : res.status(500).send({message: "Error, something went wrong"})
            }) : res.status(500).send({message: "this name has already been taken"})
        }, req.body.id)
    },

    reorder(req, res) {
        const query = `UPDATE ${Category.table}
                       SET cat_order = 0`
        db.query(query, (err, update) => {
            if (err) console.log(err)
            update.affectedRows > 0 ? res.send({message: "success"}) : res.status(500).send("Error, something went wrong")
        })
    },

    update(data, callBack) {
        const query = `UPDATE ${Category.table}
                       SET name           = '${data.name}',
                           image          = '${data.image}',
                           cat_order      = '${data.cat_order}',
                           sub_categories = '${data.sub_categories}'
                       WHERE id = ${data.id}`
        db.query(query, (err, update) => {
            if (err) console.log(err)
            update.affectedRows === 1 ? callBack(true) : callBack(false)
        })
    },

    delete(req, res) {
        const id = req.body.id
        let query = `UPDATE ${Category.table}
                     SET is_deleted = 1
                     WHERE id = ${id}`

        db.query(query, (err, results) => {
            if (err) console.log(err)
            results ? res.send({message: "success"}) : res.status(500).send({message: "Something went wrong!"})
        })
    },

    status(req, res) {
        const id = req.params.id
        console.log(req.params.status)
        if (req.params.status === "true") status.active(id, Category.table, (response) => {
            res.send({message: "activated"})
        })
        else status.block(id, Category.table, (response) => {
            res.send({message: "blocked"})
        })
    }
};

export default Category;
