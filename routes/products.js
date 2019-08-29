const express = require('express');
const router = express();
const multer = require('multer');
const db = require('../db/index');

// get all products
router.get("/", (req, res, next) => {
  db.raw("SELECT posts.pid, COUNT (likes.pid) AS numlikes, post_type, posts.username, time_posted, description, name, product_type, price, affiliated_link, hairstyle, hair_length, hair_type, face_shape FROM posts LEFT OUTER JOIN likes ON posts.pid=likes.pid GROUP BY posts.pid ORDER BY numlikes DESC")
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

//get all product sorted by price high to low
router.get("/hightolow", (req, res, next) => {
  db.raw("SELECT posts.pid, COUNT (likes.pid) AS numlikes, time_posted, description, name, product_type, price, affiliated_link FROM posts, likes WHERE posts.pid=likes.pid AND post_type='product' GROUP BY posts.pid ORDER BY price DESC")    
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

//get all product sorted by price low to high
router.get("/lowtohigh", (req, res, next) => {
db.raw("SELECT posts.pid, COUNT (likes.pid) AS numlikes, time_posted, description, name, product_type, price, affiliated_link FROM posts, likes WHERE posts.pid=likes.pid AND post_type='product' GROUP BY posts.pid ORDER BY price ASC")    
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
