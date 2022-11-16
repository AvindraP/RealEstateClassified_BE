import db from "../config/DB.js";

const PriceDetails = {
    table: "price_details",

    insert(data, callBack) {
        const query = `INSERT INTO ${PriceDetails.table} (\`ad_id\`, \`type\`, \`amount\`, \`amount_in_other\`, \`other_currency\`)
                       VALUES (${data.ad_id},' ${data.type}', '${data.amount}', '${data.amount_in_other}', '${data.other_currency}')`
        db.query(query, (err, results) => {
            if (err) console.log(err)
            else callBack(true)
        })
    }
}

export default PriceDetails