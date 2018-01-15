var express = require('express');
var router = express.Router();

var User = require("../models/user").User;

router.get('/create_user', function(req, res, next) {
  res.send("create_user");
});

module.exports = router;
