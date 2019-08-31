const express = require('express');
const router = express();
const multer = require('multer');
const db = require('../db/index');

router.get('/:pid', (req, res, next) => { 
  console.log(req.params.pid)
  db.raw(`SELECT pid, username, comment_text, time_posted FROM comments WHERE pid=${req.params.pid};`) 
  .then(comments => { 
    res.status(200).json(comments.rows)
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
});

module.exports = router;
