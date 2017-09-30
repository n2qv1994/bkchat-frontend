var express = require('express');
var router = express.Router();
var room_model = require('../models/room_model');

router.get('/:meeting_link', check_login, room_model.join_room);

function check_login(req, res, next) {
  if(req.session.user) {
    next();     //If session exists, proceed to page
  }
  else {
    res.redirect('/login');
  }
};

module.exports = router;
