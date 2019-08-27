const express = require("express");
const router = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const knex = require('knex');
var db = knex({
  client: 'pg',
  connection: {
    host: 'slickk.cnai4blomaps.us-east-2.rds.amazonaws.com',
    port: '5432',
    user: 'slickk',
    password: 'Okcthunder35',
    database: 'slickk1'
  }
});

// -- routes --

// router.post("/signup", ( req, res, next ) => {
// 	db.select('*').from('users').where('email', req.body.email)
// 	.exec()
// 	.then(user => {
// 		if (user.length >= 1) {
// 			return res.status(409).json({
// 				message: "This email is already in use"
// 			});
// 		} else {
//       db.insert([{x: 20}, {y: 30},  {x: 10, y: 20}]).into('users')	
// 		    .then(result => {
// 		      res.status(201).json({
// 		        message: "User created"
// 		      });
// 		    })
// 		    .catch(err) => {
// 		      res.status(500).json({
// 		        error: err
// 		      });
// 		    }
// 		}
// 	})
// });

//user signin route
router.post("/signin", (req, res, next) => {
  db.select('*').from('users').where('email', req.body.email)
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
        if (req.body.password != user[0].password) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        else {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0].username
            },
            //secret key
            "secret key",
            {
                expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            user: {
            	username: user[0].username,
            	email: user[0].email,
              token: token,

            }
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
.catch = (err) => {
  res.status(500).json({
    error: err
  });
}


//get likes from specific user route
router.post("/likes", (req, res, next) => {
  db.select('pid').from('likes').where('username', req.body.username)
  .then(likes => {
      res.status(200).json(likes);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


//add a like from a user in the database
router.post("/post/like", (req, res, next) => {
  db('likes').insert({
    username: req.body.username,
    pid: req.body.pid
  })
  .then(resp =>{
    res.status(200).json({
      message: "successful insertion"
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});


//delete a like from a user in database
router.delete("/post/like", (req, res, next) => {
  db('likes')
    .where({
      username: req.body.username,
      pid: req.body.pid
    })
    .del()
  .then(resp =>{
    res.status(200).json({
      message: "successful deletion"
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

//add a user comment to database
router.post("/post/comment", (req, res, next) => {
  db('comments').insert({
    username: req.body.username,
    pid: req.body.pid,
    comment_text: req.body.comment_text,
    time_posted: db.raw('now()'),
  },)
  .then(resp =>{
    res.status(200).json({
      message: "successful insertion"
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});



module.exports = router;