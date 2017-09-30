var express = require('express');
var meeting_model = require('../models/meeting_model');
var router = express.Router();

/* GET meeting listings. */
router.get('/', check_login, meeting_model.index);

router.get('/previous', check_login, meeting_model.get_previous_meeting);

router.get('/upcomming', check_login, meeting_model.get_upcomming_meeting);

router.get('/schedule', check_login, meeting_model.get_schedule_meeting);

router.get('/create', check_login, meeting_model.create);

router.post('/create', check_login, meeting_model.create_schedule);

router.get('/:meeting_id', check_login, meeting_model.get_room);

router.get('/:meeting_id/edit', check_login, meeting_model.edit);

function check_login(req, res, next) {
  if(req.session.user) {
    next();     //If session exists, proceed to page
  }
  else {
    res.redirect('/login');
  }
}

module.exports = router;
