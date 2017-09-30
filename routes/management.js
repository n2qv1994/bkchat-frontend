var express = require('express');
var meeting_model = require('../models/meeting_model');
var user_model = require('../models/user_model');
var recording_model = require('../models/recording_model');
var config     = require('../config/config')();
var router = express.Router();

/* GET meeting listings. */
router.get('/meeting_managemant', check_login, meeting_model.index_management);

router.get('/meeting_managemant/meeting', check_login, meeting_model.get_all_previous_meeting);

router.get('/meeting_managemant/upcomming', check_login, meeting_model.get_all_upcomming_meeting);

router.get('/meeting_managemant/schedule', check_login, meeting_model.get_all_schedule_meeting);

router.get('/user_management', check_login, user_model.user_management);

router.get('/user_management/create', check_login, function(req, res, next) {
  res.render('users/create', { data: {
                          title: 'BK Media | Profile',
                          page: 'profile',
                          host: config.HOST,
                          message: null,
                          user: req.session.user.data
                        }
                      });
});

/* create user. */
router.put('/user_management/create', check_login, user_model.create_user);

router.get('/meeting_managemant/:meeting_id', check_login, meeting_model.room_detail);

router.get('/recording_management', check_login, recording_model.get_all_recording);
router.post('/recording_management', check_login, recording_model.add_video);

function check_login(req, res, next) {
  if(req.session.user) {
    next();     //If session exists, proceed to page
  }
  else {
    res.redirect('/login');
  }
}

module.exports = router;
