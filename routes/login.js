var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
  res.send("login");
});

module.exports = router;
