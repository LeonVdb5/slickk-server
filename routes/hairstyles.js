const express = require('express');
const router = express();
const multer = require('multer');
const db = require('../db/index');

// get all hairstyle posts
router.get("/", (req, res, next) => {
  db.raw("SELECT posts.pid, COUNT (likes.pid) AS numlikes, username, time_posted, post_type, description, hairstyle, hair_length, hair_type, face_shape FROM posts, likes WHERE posts.pid=likes.pid AND post_type='hairstyle' GROUP BY posts.pid")
    .then(products => {
    	res.status(200).json(products.rows);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
