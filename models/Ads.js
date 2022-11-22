import db from "../config/DB.js";
import Upload from "../helpers/upload.js";
import AdsDetails from "./AdsDetails.js";
import PriceDetails from "./PriceDetails.js";
import SubCategory from "./SubCategory.js";
import Advertisers from "./Advertisers.js";
import status from "../helpers/status.js";

const Ads = {
    table: "ads",

    create(req, res) {
        const ads = req.body
        Upload.images(req.files, 'ads-path/', (fileNames) => {
            if (fileNames.length === req.files.length) {
                ads.images = JSON.stringify(fileNames)
                Ads.insert(ads, (response) => {
                    const id = response
                    ads.ad_id = id
                    AdsDetails.insert(ads, (response) => {
                        if (response) {
                            PriceDetails.insert(ads, (response) => {
                                if (response) res.send({message: "success"})
                            })
                        }
                    })
                })
            }
        })
    },

    insert(data, callBack) {
        const query = `INSERT INTO ${Ads.table} (\`city_id\`, \`user_id\`, \`sub_category_id\`, \`offer_type\`)
                       VALUES (${data.city_id}, ${data.user_id}, ${data.sub_category_id}, ${data.offer_type})`
        db.query(query, (err, results) => {
            if (err) console.log(err)
            else {
                const id = results.insertId
                callBack(id)
            }
        })
    },

    get: {
        all(req, res) {
            const query = `SELECT ${Ads.table}.*,
                                  ${Advertisers.table}.*,
                                  ${AdsDetails.table}.*,
                                  ${PriceDetails.table}.*,
                                  ${SubCategory.table}.name as 'sub_category'
                           FROM ${Ads.table}
                                    JOIN ${AdsDetails.table} ON ${Ads.table}.id = ${AdsDetails.table}.ad_id
                                    JOIN ${PriceDetails.table} ON ${Ads.table}.id = ${PriceDetails.table}.ad_id
                                    JOIN ${SubCategory.table} ON ${Ads.table}.sub_category_id = ${SubCategory.table}.id
                                    JOIN ${Advertisers.table} ON ${Ads.table}.user_id = ${Advertisers.table}.user_id`
            db.query(query, (err, ads) => {
                if (err) console.log(err)
                res.send({results: ads})
            })
        },
        published(req, res) {
            const query = `SELECT ${Ads.table}.*,
                                  ${Advertisers.table}.*,
                                  ${AdsDetails.table}.*,
                                  ${PriceDetails.table}.*,
                                  ${SubCategory.table}.name as 'sub_category'
                           FROM ${Ads.table}
                                    JOIN ${AdsDetails.table} ON ${Ads.table}.id = ${AdsDetails.table}.ad_id
                                    JOIN ${PriceDetails.table} ON ${Ads.table}.id = ${PriceDetails.table}.ad_id
                                    JOIN ${SubCategory.table} ON ${Ads.table}.sub_category_id = ${SubCategory.table}.id
                                    JOIN ${Advertisers.table} ON ${Ads.table}.user_id = ${Advertisers.table}.user_id
                           WHERE ${Ads.table}.is_published = 1`
            db.query(query, (err, ads) => {
                if (err) console.log(err)
                res.send({results: ads})
            })
        },
        unPublished(req, res) {
            const query = `SELECT ${Ads.table}.*,
                                  ${Advertisers.table}.*,
                                  ${AdsDetails.table}.*,
                                  ${PriceDetails.table}.*,
                                  ${SubCategory.table}.name as 'sub_category'
                           FROM ${Ads.table}
                                    JOIN ${AdsDetails.table} ON ${Ads.table}.id = ${AdsDetails.table}.ad_id
                                    JOIN ${PriceDetails.table} ON ${Ads.table}.id = ${PriceDetails.table}.ad_id
                                    JOIN ${SubCategory.table} ON ${Ads.table}.sub_category_id = ${SubCategory.table}.id
                                    JOIN ${Advertisers.table} ON ${Ads.table}.user_id = ${Advertisers.table}.user_id
                           WHERE ${Ads.table}.is_published = 0`
            db.query(query, (err, ads) => {
                if (err) console.log(err)
                res.send({results: ads})
            })
        },
        approved(req, res) {
            const query = `SELECT ${Ads.table}.*,
                                  ${Advertisers.table}.*,
                                  ${AdsDetails.table}.*,
                                  ${PriceDetails.table}.*,
                                  ${SubCategory.table}.name as 'sub_category'
                           FROM ${Ads.table}
                                    JOIN ${AdsDetails.table} ON ${Ads.table}.id = ${AdsDetails.table}.ad_id
                                    JOIN ${PriceDetails.table} ON ${Ads.table}.id = ${PriceDetails.table}.ad_id
                                    JOIN ${SubCategory.table} ON ${Ads.table}.sub_category_id = ${SubCategory.table}.id
                                    JOIN ${Advertisers.table} ON ${Ads.table}.user_id = ${Advertisers.table}.user_id
                           WHERE ${Ads.table}.is_approved = 1`
            db.query(query, (err, ads) => {
                if (err) console.log(err)
                res.send({results: ads})
            })
        },
        pending(req, res) {
            const query = `SELECT ${Ads.table}.*,
                                  ${Advertisers.table}.*,
                                  ${AdsDetails.table}.*,
                                  ${PriceDetails.table}.*,
                                  ${SubCategory.table}.name as 'sub_category'
                           FROM ${Ads.table}
                                    JOIN ${AdsDetails.table} ON ${Ads.table}.id = ${AdsDetails.table}.ad_id
                                    JOIN ${PriceDetails.table} ON ${Ads.table}.id = ${PriceDetails.table}.ad_id
                                    JOIN ${SubCategory.table} ON ${Ads.table}.sub_category_id = ${SubCategory.table}.id
                                    JOIN ${Advertisers.table} ON ${Ads.table}.user_id = ${Advertisers.table}.user_id
                           WHERE ${Ads.table}.is_approved = 0`
            db.query(query, (err, ads) => {
                if (err) console.log(err)
                res.send({results: ads})
            })
        },
        top(req, res) {
            const query = `SELECT ${Ads.table}.*,
                                  ${Advertisers.table}.*,
                                  ${AdsDetails.table}.*,
                                  ${PriceDetails.table}.*,
                                  ${SubCategory.table}.name as 'sub_category'
                           FROM ${Ads.table}
                                    JOIN ${AdsDetails.table} ON ${Ads.table}.id = ${AdsDetails.table}.ad_id
                                    JOIN ${PriceDetails.table} ON ${Ads.table}.id = ${PriceDetails.table}.ad_id
                                    JOIN ${SubCategory.table} ON ${Ads.table}.sub_category_id = ${SubCategory.table}.id
                                    JOIN ${Advertisers.table} ON ${Ads.table}.user_id = ${Advertisers.table}.user_id
                           WHERE ${Ads.table}.is_top = 1`
            db.query(query, (err, ads) => {
                if (err) console.log(err)
                res.send({results: ads})
            })
        },
        hidden(req, res) {
            const query = `SELECT ${Ads.table}.*,
                                  ${Advertisers.table}.*,
                                  ${AdsDetails.table}.*,
                                  ${PriceDetails.table}.*,
                                  ${SubCategory.table}.name as 'sub_category'
                           FROM ${Ads.table}
                                    JOIN ${AdsDetails.table} ON ${Ads.table}.id = ${AdsDetails.table}.ad_id
                                    JOIN ${PriceDetails.table} ON ${Ads.table}.id = ${PriceDetails.table}.ad_id
                                    JOIN ${SubCategory.table} ON ${Ads.table}.sub_category_id = ${SubCategory.table}.id
                                    JOIN ${Advertisers.table} ON ${Ads.table}.user_id = ${Advertisers.table}.user_id
                           WHERE ${Ads.table}.is_deleted = 1`
            db.query(query, (err, ads) => {
                if (err) console.log(err)
                res.send({results: ads})
            })
        },
    },

    approve(req, res) {
        const id = req.params.id
        const approve = req.params.approve_status
        if (approve === 'true') status.active(id, Ads.table, 'is_approved', (response) => {
            res.send({message: 'approved'})
        })
        else status.block(id, Ads.table, 'is_approved', (response) => {
            res.send({message: 'not approved'})
        })
    },

    publish(req, res) {
        const id = req.params.id
        const publish = req.params.publish_status
        if (publish === 'true') status.active(id, Ads.table, 'is_published', (response) => {
            res.send({message: 'published'})
        })
        else status.block(id, Ads.table, 'is_published', (response) => {
            res.send({message: 'not published'})
        })
    },

    top(req, res) {
        const id = req.params.id
        const top = req.params.top_status
        if (top === 'true') status.active(id, Ads.table, 'is_top', (response) => {
            res.send({message: 'top add'})
        })
        else status.block(id, Ads.table, 'is_top', (response) => {
            res.send({message: 'not top'})
        })
    }
}

export default Ads