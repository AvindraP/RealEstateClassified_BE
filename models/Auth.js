const Auth = {
    table: "users",

    login(req, res) {
        res.send({msg: "working"})
    }
}

export default Auth

