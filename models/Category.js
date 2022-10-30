import db from "../config/DB.js";
import validate from "../helpers/validate.js";
import Upload from "../helpers/upload.js";
import SubCategory from "./SubCategory.js";

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
                            ? res.status(200).send({message: "success", id: response})
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
                       VALUES (?, ?, ?, ?, ?)`;
        db.query(query, arr, (err, result) => {
            err ? console.log(err) : callBack(result.insertId);
        });
    },

    get: {
        all(req, res) {
            const query = `SELECT *
                           FROM ${Category.table}`
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
};

export default Category;
