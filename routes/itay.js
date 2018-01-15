var express = require('express');
var router = express.Router();

router.get('/itay', function(req, res, next) {
  res.send("itay");
});

module.exports = router;
