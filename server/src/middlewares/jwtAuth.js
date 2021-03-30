const User = require("../models/User");
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err, token) => {
        if (err) {
            return res.status(401).json({
                error: err,
            })
        } else {
            User.findOne({email: token.username}).then(user => {
                if (user) {
                    req.params.token = token
                    next()
                } else {
                    return res.status(401).json({
                        messageBag: [{msg: 'User no longer exists'}]
                    })
                }
            })
        }
    })
}
