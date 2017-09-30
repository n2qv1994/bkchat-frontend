var express    = require('express');
var user_model = require('../models/user_model');
var config     = require('../config/config')();
var router  = express.Router();

/* GET home page. */
router.get('/', check_login, user_model.get_room_this_month);
router.get('/sign_out', function(req,res, next) {
  req.session.user.token = "";
  res.render('login', { data: {
                            title: "BK Media | Login",
                            page: 'login',
                            message: "",
                            host: config.HOST,
                            user: {
                              username: "",
                              password: ""
                            }
                          }
                        });
});

router.get('/login', function(req, res, next) {
  if(req.session.user) {
    res.redirect('/');     //If session exists, proceed to page
  }
  else {
    res.render('login', { data: {
                            title: "BK Media | Login",
                            page: 'login',
                            message: "",
                            host: config.HOST,
                            user: {
                              username: "",
                              password: ""
                            }
                          }
                        });
  }
});

router.post('/login', user_model.login);

router.get('/room_unavailable', function(req, res, next) {
  res.render('room_error', { data: {
                      title: 'BK Media | Err',
                      page: 'err',
                      host: config.HOST,
                      user: req.session.user.data,
                      message: "room unnavaliable"
                    }
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
