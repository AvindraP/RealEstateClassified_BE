const convert = {
    body(body) {
        const keys = Object.keys(body)
        const arr = []
        let data = []

        keys.forEach(key => {
            arr.push(body[key])
        })

        keys.forEach(key => {
            let obj = {}
            obj[key] = body[key]
            data.push(obj)
        })

        return Object.assign({}, ...data)
    }
}

export default convert