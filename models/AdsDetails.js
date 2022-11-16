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
    }
}

export default AdsDetails