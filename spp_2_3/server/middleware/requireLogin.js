const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys');
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = ((req, res, next) => {
    const {authorization} = req.headers
    if (!authorization) {
        res.statusCode = 401
        res.json({error: "You must be logged in"})
        return
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET,(error, payload) => {
        if (error) {
            res.statusCode = 401
            res.json({error: "You must be logged in"})
            return
        }

        const {_id} = payload
        User.findById(_id).then(userData => {
            req.user = userData
            next()
        })
    })
})