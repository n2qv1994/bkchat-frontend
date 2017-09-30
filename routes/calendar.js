var express = require('express');
var config = require('../config/config')();
var request    = require('request');
var moment     = require('moment');
var config     = require('../config/config')();
var router = express.Router();

/* GET calendar listing. */
router.get('/', check_login, function(req, res, next) {

  var options = {
    url: config.schedule_meetings,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.session.user.token
    }
  };
  request.get(options, function(err, response, body) {
    var data = [];
    var message = "";
    if(!err && response.statusCode == 200) {
      data = JSON.parse(body).success.data;
    }
    else {
      message = err;
    }
    res.render('calendar', { data: {
                          title: 'BK Media | Calendar',
                          page: 'calendar',
                          host: config.HOST,
                          user: req.session.user.data,
                          data: data
                        }
                      });
  });



  
});

function check_login(req, res, next) {
  if(req.session.user) {
    next();     //If session exists, proceed to page
  }
  else {
    res.redirect('/login');
  }
}

module.exports = router;
