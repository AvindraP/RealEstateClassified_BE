import db from "../config/DB.js";
import Upload from "../helpers/upload.js";
import AdsDetails from "./AdsDetails.js";
import PriceDetails from "./PriceDetails.js";

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
    }
}

export default Ads