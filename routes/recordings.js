var express = require('express');
var recording_model = require('../models/recording_model');
var router = express.Router();

/* GET */
router.get('/', check_login, recording_model.get_recording);

function check_login(req, res, next) {
  if(req.session.user) {
    next();     //If session exists, proceed to page
  }
  else {
    res.redirect('/login');
  }
}

module.exports = router;
