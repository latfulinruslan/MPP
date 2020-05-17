const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");

router.get('/posts', requireLogin, (req, res) => {
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts => {
        res.json({posts: posts});
    })
    .catch(error => {
        console.log(error);
    })
})

router.get('/getsubpost', requireLogin, (req, res) => {
    Post.find({postedBy: {$in: req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts => {
        res.json({posts: posts});
    })
    .catch(error => {
        console.log(error);
    })
})

router.post('/createpost', requireLogin, (req, res) => {
    const {title, body, url} = req.body;

    if (!title || !body || !url) {
        res.statusCode = 422;
        res.json({error: "Bad data"});
        return
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo: url,
        postedBy: req.user,
    })
    post.save().then(result => {
        res.json({post: result});
    })
    .catch(error => {
        console.log(error);
    })
})

router.get('/myposts', requireLogin, (req, res) => {
    Post.find({postedBy: req.user._id})
    .populate("postedBy", "_id name")
    .then(myposts => {
        res.json({myposts});
    })
    .catch(error => {
        console.log(error);
    })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes: req.user._id}
    }, {
        new: true
    }).exec((error, result) => {
        if (error) {
            res.status(422);
            res.json({error: error});
            return
        } else {
            res.json(result);
        }
    })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id}
    }, {
        new: true
    }).exec((error, result) => {
        if (error) {
            res.status(422);
            res.json({error: error});
            return
        } else {
            res.json(result);
        }
    })
})

router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {comments: comment}
    }, {
        new: true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy","_id name")
    .exec((error, result) => {
        if (error) {
            res.status(422);
            res.json({error: error});
            return
        } else {
            res.json(result);
        }
    })
})

router.delete('/delete/:postId', requireLogin, (req, res) => {
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((error, post) => {
        if (error || !post) {
            res.status(422);
            res.json({error: error});
            return
        }
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then(result => {
                res.json(result);
            })
            .catch(error => {
                console.log(error);
            })
        }
    })
})

module.exports = router