const Auth = {
    table: "users",

    login(req, res) {
        res.send(req.body)
    }
}

export default Auth

