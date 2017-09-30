var request    = require('request');
var moment     = require('moment');
var config     = require('../config/config')();

exports.get_recording = function(req, res, next) {
  var options = {
    url: config.previous_meetings,
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
      for(var i = 0; i < data.length; i++) {
        data[i].started_at = moment(data[i].started_at).format('LLL');
      }
    }
    else {
      message = err;
    }
    res.render('recording', { data: {
                              title: 'BK Media | Recordings',
                              page: 'recording',
                              meeting: data,
                              host: config.HOST,
                              user: req.session.user.data
                            }
                        });
  });
};

exports.get_all_recording = function(req, res, next) {
  var options = {
    url: config.recording,
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
    res.render('recording_management', { data: {
                            title: "BK Media | Recordings",
                            page: 'record_management',
                            message: message,
                            host: config.HOST,
                            user: req.session.user.data,
                            item: data
                          }
                    });
  });
};

exports.add_video = function(req, res, next) {
  var options = {
    url: config.upload,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.session.user.token
    },
    form: req.body
  };
  request.post(options, function(err, response, body) {
    var data = [];
    var message = "";
    if(!err && response.statusCode == 200) {
      data = JSON.parse(body).success.data;
      res.redirect('/management/recording_management');
    }
    else {
      message = "upload false";
    }
  });
};