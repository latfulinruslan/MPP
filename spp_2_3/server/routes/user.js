const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({_id: req.params.id})
    .select("-password")
    .then(user => {
        Post.find({postedBy: req.params.id})
        .populate("postedBy", "_id name")
        .exec((error, posts) => {
            if (error) {
                res.status(422);
                res.json({error: error});
                return
            }
            res.json({user, posts})
        })
    })
    .catch(error => {
        res.status(404);
        res.json({error: "User not found"});
    })
})

router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: {followers: req.user._id}
    }, {
        new: true
    }, (error, result) => {
        if (error) {
            res.status(422);
            res.json({error: error});
            return
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: {following: req.body.followId}
        }, {
            new: true
        })
        .select("-password")
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            res.status(422);
            res.json({error: error});
            return
        })
    })
})

router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: {followers: req.user._id}
    }, {
        new: true
    }, (error, result) => {
        if (error) {
            res.status(422);
            res.json({error: error});
            return
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: {following: req.body.unfollowId}
        }, {
            new: true
        })
        .select("-password")
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            res.status(422);
            res.json({error: error});
            return
        })
    })
})

router.put('/updateprofileimage', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {$set: {image: req.body.image}}, { new: true }, 
        (error, result) => {
            if (error) {
                res.status(422);
                res.json({error: error});
                return
            }
            res.json(result)
    })
})

module.exports = router