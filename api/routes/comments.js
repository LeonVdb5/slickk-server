const express = require('express');
const router = express();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const knex = require('knex');
const db = knex({
  client: 'pg',
  connection: {
    host: 'slickk.cnai4blomaps.us-east-2.rds.amazonaws.com',
    port: '5432',
    user: 'slickk',
    password: 'Okcthunder35',
    database: 'slickk1'
  }
});

router.get('/:pid', (req, res, next) => { 
  db.raw("SELECT pid, username, comment_text, time_posted FROM comments") 
  .then(comments => { 
    const result = comments.rows.filter(comment => comment.pid == req.params.pid)
    res.status(200).json(result)
  })
   .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});








module.exports = router;

