const express = require("express");
const router = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require('../db/index');
const passport = require('passport'); 
const passportConf = require('../passport');  //this will let passport.authenticate() find strategy 
const UserControllers = require('../controllers/users');

// router.get('/secret', passport.authenticate('jwt', {session: false}), (req, res, next) => { //export req, res, next to controller fcn
//   res.json({success: 'success'})
// })

// router.get('/updatePassword', (req, res, next) => {
//   const saltRounds = 10;
//   bcrypt.hash('compsci', saltRounds)
//   .then(hashedPassword => {
//     db('users').where('password', 'compsci')
//     .update({
//       password: hashedPassword,
//     })
//     .catch(error => res.json({error: error}))
//   })
//   .then(() => {
//     res.status(200).json({message: 'updated passwords'})
//   })
// }) 

router.post('/login', passport.authenticate('local', {session: false}), UserControllers.login);

router.post('/register', UserControllers.register);

// //route for UI to check if cookies exist 
router.get('/status', passport.authenticate('jwt', {session: false}), UserControllers.checkAuth);

//route to clear cookie, effectively signing out a user 
router.get('/signout', passport.authenticate('jwt', {session: false}), UserControllers.signOut);

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
   console.log(resp);
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