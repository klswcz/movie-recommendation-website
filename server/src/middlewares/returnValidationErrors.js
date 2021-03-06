const {validationResult} = require('express-validator')

module.exports = (req, res, next) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({messageBag: errors.array({ onlyFirstError: true })});
    } else {
        next()
    }
}
