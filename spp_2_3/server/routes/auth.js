const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');

router.get('/protected', requireLogin, (req, res) => {
    res.send("hello")
})

router.post('/signup', (req, res) => {
    const {name, email, password, image} = req.body
    if (!email || !password || !name) {
        res.statusCode = 422
        res.json({error: "Bad data"})
        return
    }

    User.findOne({email: email})
    .then((savedUser) => {
        if (savedUser) {
            res.statusCode = 422
            res.json({error: "User already exist"})
            return
        }
        bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email,
                password: hashedPassword, 
                name,
                image
            })
            
            user.save()
            .then(user => {
                res.json({message: "Succesful saved"})
            })
            .catch(error => {
                console.log(error);
            })
        })
        
    })
    .catch(error => {
        console.log(error)
    })
})

router.post('/login', (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        res.statusCode = 422
        res.json({error: "Bad data"})
        return
    }
    User.findOne({email: email})
    .then(savedUser => {
        if(!savedUser) {
            res.statusCode = 422
            res.json({error: "Invalid email or password"})
            return
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if (doMatch) {
                // res.json({message: "Successful sign in"})
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                const {_id, name, email, followers, following, image} = savedUser
                res.json({token, user: {_id, name, email, followers, following, image}})
            } else { 
                res.statusCode = 422
                res.json({error: "Invalid email or password"})
                return
            }
        })
        .catch(error => {
            console.log(error)
        })
    })
})

module.exports = router