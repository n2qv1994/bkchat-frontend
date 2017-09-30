var express = require('express');
var router = express.Router();
var config     = require('../config/config')();
var user_model = require('../models/user_model');

/* GET users listing. */
router.get('/', check_login, user_model.get_users);

/* GET profile. */
router.get('/profile', check_login, function(req, res, next) {
  res.render('users/profile', { data: {
                          title: 'BK Media | Profile',
                          page: 'profile',
                          host: config.HOST,
                          message: null,
                          user: req.session.user.data
                        }
                      });
});

/* PUT profile. */
router.put('/profile', check_login, user_model.update_profile);

/* GET activities */
router.get('/activities', check_login, user_model.get_activities);

function check_login(req, res, next) {
  if(req.session.user) {
    next();     //If session exists, proceed to page
  }
  else {
    res.redirect('/login');
  }
}

module.exports = router;
