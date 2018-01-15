var express = require('express');
var router = express.Router();

router.get('/connection', function(req, res, next) {
  res.send("connection");
});

module.exports = router;
