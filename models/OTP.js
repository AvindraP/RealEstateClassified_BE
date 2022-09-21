import db from '../config/DB.js'
import TempDetail from './TempDetail.js'
import User from './User.js'
import ShoutoutClient from 'shoutout-sdk'

const OTP = {
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NjNkNWE1MC1lN2Q5LTExZWMtYTRjYy1hNTdlMjZhNThkNjMiLCJzdWIiOiJTSE9VVE9VVF9BUElfVVNFUiIsImlhdCI6MTY1NDc2ODE5OCwiZXhwIjoxOTcwMzg3Mzk4LCJzY29wZXMiOnsiYWN0aXZpdGllcyI6WyJyZWFkIiwid3JpdGUiXSwibWVzc2FnZXMiOlsicmVhZCIsIndyaXRlIl0sImNvbnRhY3RzIjpbInJlYWQiLCJ3cml0ZSJdfSwic29fdXNlcl9pZCI6IjY4NjUxIiwic29fdXNlcl9yb2xlIjoidXNlciIsInNvX3Byb2ZpbGUiOiJhbGwiLCJzb191c2VyX25hbWUiOiIiLCJzb19hcGlrZXkiOiJub25lIn0.T1YjHd5tHwKZWYT8C9ozJp26gOJMSu2GGeCX2b3CDNg",
    table: 'otps',
    otpId: '',
    debug: false,
    verifySSL: false,

    insert(otp, callBack) {
        const query = `INSERT INTO ${this.table} (code)
                       VALUES (${otp})`
        db.query(query, (err, res) => {
            res ? callBack(res.insertId) : callBack(false)
        })
    },

    createOtp() {
        let pin = Math.round(Math.random() * 10000);
        let pinStr = pin + '';

        // make sure that number is 4 digit
        if (pinStr.length == 4) {
            return pinStr;
        } else {
            return this.createOtp();
        }
    },

    send(phone, callBack) {
        const OTP = this.createOtp()
        const client = new ShoutoutClient(this.apiKey, this.debug, this.verifySSL)
        // insert OTP
        this.insert(OTP, (r) => {
            const message = {
                source: 'ShoutDEMO',
                destinations: [phone],
                content: {
                    sms: `OTP: ${OTP}`,
                },
                transports: ['sms']
            };
            client.sendMessage(message, (error, result) => {
                if (error) {
                    callBack(false)
                } else {
                    callBack(r)
                }
            });
        })
    },

    remove(id, callBack) {
        const query = `DELETE
                       FROM ${this.table}
                       WHERE id = ${id}`
        db.query(query, (err, res) => {
            if (err) console.log(err)
            else {
                TempDetail.remove(id, callBack)
            }
        })
    },

    verify(res, req) {
        const otp = req.param('otp')

        this.check(otp, (r) => {
            if (r) {
                this.otpId = r[0].id
                TempDetail.get(this.otpId, (r) => {
                    User.store(r[0], (r) => {
                        this.remove(this.otpId, (r) => {
                            r ? res.send("deleted") : res.send("not deleted")
                        })
                    })
                })
            } else res.send("invalid otp")
        })
    },

    check(otp, callBack) {
        const query = `SELECT id
                       FROM ${this.table}
                       WHERE code = ${otp}`

        db.query(query, (err, res) => {
            if (err) new Error(err)
            else {
                res.length > 0 ? callBack(res) : callBack(false)
            }
        })
    }
}
export default OTP