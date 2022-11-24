import db from "../config/DB.js";

const AdsDetails = {
    table: "ads_details",

    insert(data, callBack) {
        const query = `INSERT INTO ${AdsDetails.table} (\`ad_id\`, \`title\`, \`description\`, \`contact\`, \`fields\`,
                                                        \`images\`, \`amenities\`)
                       VALUES (${data.ad_id}, '${data.title}', '${data.description}', '${data.contact}', '${data.fields}', '${data.images}', '${data.amenities}')`
        db.query(query, (err, results) => {
            if (err) console.log(err)
            else callBack(true)
        })
    },

    update(data, callBack) {
        const query = `UPDATE ${AdsDetails.table}
                       SET title       = '${data.title}',
                           description = '${data.description}',
                           contact     = '${data.contact}',
                           fields      = '${data.fields}',
                           images      = '${data.images}',
                           amenities   = '${data.amenities}'
                       WHERE ad_id = ${data.ad_id}`
        db.query(query, (err, update) => {
            if (err) console.log(err)
            update.affectedRows === 1 ? callBack(true) : callBack(false)
        })
    }
}

export default AdsDetails