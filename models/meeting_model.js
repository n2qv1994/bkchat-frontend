var request    = require('request');
var moment     = require('moment');
var moment_tz  = require('moment-timezone');
var config     = require('../config/config')();

exports.index = function(req, res, next) {
  var options = {
    url: config.get_meetings,
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
        data[i].link = config.HOST + "rooms/" + data[i].link;
      }
    }
    else {
      message = err;
    }
    res.render('meetings/index', { data: {
                            title: 'BK Media | Meetings',
                            page: 'meeting',
                            tab: 'upcomming',
                            meeting: data,
                            host: config.HOST,
                            previous_meeting: [],
                            schedule_meeting: [],
                            user: req.session.user.data
                          }
                        });
  });
};

exports.get_upcomming_meeting = function(req, res, next) {
  var options = {
    url: config.get_meetings,
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
        data[i].link = config.HOST + "rooms/" + data[i].link;
      }
    }
    else {
      message = err;
    }
    res.render('meetings/index', { data: {
                            title: 'BK Media | Meetings',
                            page: 'meeting',
                            tab: 'upcomming',
                            meeting: data,
                            host: config.HOST,
                            previous_meeting: [],
                            schedule_meeting: [],
                            user: req.session.user.data
                          }
                        });
  });
};

exports.get_previous_meeting = function(req, res, next) {
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
    res.render('meetings/index', { data: {
                            title: 'BK Media | Meetings',
                            page: 'meeting',
                            tab: 'previous',
                            host: config.HOST,
                            meeting: [],
                            previous_meeting: data,
                            schedule_meeting: [],
                            user: req.session.user.data
                          }
                        });
  });
};

exports.get_schedule_meeting = function(req, res, next) {
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
      for(var i = 0; i < data.length; i++) {
        data[i].started_at = moment(data[i].started_at).format('LLL');
      }
    }
    else {
      message = err;
    }
    res.render('meetings/index', { data: {
                            title: 'BK Media | Meetings',
                            page: 'meeting',
                            tab: 'schedule',
                            host: config.HOST,
                            meeting: [],
                            previous_meeting: [],
                            schedule_meeting: data,
                            user: req.session.user.data
                          }
                        });
  });
};

exports.get_room = function(req, res, next) {
  var room_code = req.params.meeting_id || '';
  if(room_code === '') {
    res.render('meetings/index', { data: {
                            title: 'BK Media | Meetings',
                            page: 'meeting',
                            tab: 'schedule',
                            host: config.HOST,
                            meeting: [],
                            previous_meeting: [],
                            schedule_meeting: [],
                            user: req.session.user.data
                          }
                        });
  }

  var options = {
    url: config.get_room + '/' + room_code,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.session.user.token
    }
  };

  request.get(options, function(err, response, body) {
    var message = "";
    if(!err && response.statusCode == 200) {
      var data = JSON.parse(body).success.data;
      data.started_at = moment_tz(data.started_at).tz('Asia/Ho_Chi_Minh').format('LLL');
      data.created_at = moment_tz(data.created_at).tz('Asia/Ho_Chi_Minh').format('LLL');
      data.updated_at = moment_tz(data.updated_at).tz('Asia/Ho_Chi_Minh').format('LLL');
      data.link = config.HOST + "rooms/" + data.link;
      res.render('meetings/show', { data: {
                              title: 'BK Media | Meetings',
                              page: 'meeting',
                              message: message,
                              host: config.HOST,
                              item: data,
                              user: req.session.user.data
                            }
                          });
    }
    else {
      message = err;
      res.render('meetings/show', { data: {
                              title: 'BK Media | Meetings',
                              page: 'meeting',
                              message: message,
                              host: config.HOST,
                              user: req.session.user.data
                            }
                          });
    }

  });
};

exports.edit = function(req, res, next) {
  var room_code = req.params.meeting_id || '';

  if(room_code === '') {
    res.render('meetings/index', { data: {
                            title: 'BK Media | Meetings',
                            page: 'meeting',
                            tab: 'schedule',
                            host: config.HOST,
                            meeting: [],
                            previous_meeting: [],
                            schedule_meeting: [],
                            user: req.session.user.data
                          }
                        });
  }

  var options = {
    url: config.get_room + '/' + room_code,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.session.user.token
    }
  };

  request.get(options, function(err, response, body) {
    var message = "";
    if(!err && response.statusCode == 200) {
      var data = JSON.parse(body).success.data;
      data.started_at = moment_tz(data.started_at).tz('Asia/Ho_Chi_Minh').format('LLL');
      data.created_at = moment_tz(data.created_at).tz('Asia/Ho_Chi_Minh').format('LLL');
      data.updated_at = moment_tz(data.updated_at).tz('Asia/Ho_Chi_Minh').format('LLL');
      data.link = config.HOST + "rooms/" + data.link;
    }
    else {
      message = err;
    }
    var options_get_users = {
      url: config.get_users,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + req.session.user.token
      }
    };
    request.get(options_get_users, function(err, response, body) {
      var users = [];
      var message = "";
      if(!err && response.statusCode == 200) {
        users = JSON.parse(body).success.data;
        for(var i = 0; i < data.length; i++) {
          users[i].created_at = moment(users[i].created_at).format('LLL');
          if(users[i].status === 0) {
            users[i].status = 'online';
          }
          else if(users[i].status === 1) {
            users[i].status = 'offline';
          }
          else if(users[i].status === 2) {
            users[i].status = 'busy';
          }
        }
      }
      else {
        message = err;
      }
      res.render('meetings/edit', { data: {
                            title: 'BK Media | Meetings',
                            page: 'meeting',
                            message: message,
                            host: config.HOST,
                            item: data,
                            users: users,
                            user: req.session.user.data
                          }
                        });
    });
  });
};

exports.create = function(req, res, next) {
  var options = {
    url: config.get_all_users,
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
        data[i].created_at = moment(data[i].created_at).format('LLL');
        if(data[i].status === 0) {
          data[i].status = 'online';
        }
        else if(data[i].status === 1) {
          data[i].status = 'offline';
        }
        else if(data[i].status === 2) {
          data[i].status = 'busy';
        }
      }
    }
    else {
      message = err;
    }
    res.render('meetings/create', { data: {
                            title: "BK Media | Schedule",
                            page: 'meeting',
                            host: config.HOST,
                            message: message,
                            user: req.session.user.data,
                            item: data
                          }
                    });
  });
};

exports.create_schedule = function(req, res, next) {
  var reserve = {};
  
  reserve.room_name    = req.body.room_name    || '';
  reserve.started_at   = moment_tz(req.body.start_at).tz('Asia/Ho_Chi_Minh').toISOString() || '';
  console.log("!!!!!!!!!!!!!!!!!!!!!");
  console.log(reserve.started_at);
  reserve.user_invited = [];
  reserve.limited      = req.body.limit        || '';
  reserve.description  = req.body.description  || '';

  if(typeof req.body.user_invited === 'string') {
    reserve.user_invited.push(req.body.user_invited);
  }
  else {
    for(var i = 0; i < req.body.user_invited.length; i++) {
      reserve.user_invited.push(req.body.user_invited[i]);
    }
  }

  if(reserve.room_name === '' || reserve.started_at === '' || reserve.user_invited.length === 0 || reserve.limited === '') {
    res.render('meetings/create', { data: {
                            title: "BK Media | Schedule",
                            page: 'meeting',
                            host: config.HOST,
                            message: {
                              data:"Params not valid!",
                              type: "error"
                            },
                            user: req.session.user.data,
                            item: data
                          }
                    });
  }

  var options = {
    url: config.reserve_room,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.session.user.token
    },
    form: {
      "room_name": reserve.room_name,
      "started_at": reserve.started_at,
      "limited": reserve.limited,
      "description": reserve.description,
      "user_invited": JSON.stringify(reserve.user_invited)
    }
  };
  request.post(options, function(err, response, body) {
    var data = [];
    var message = "";
    if(!err && response.statusCode == 201) {
      message = JSON.parse(body).success.data;
      res.redirect('/meetings/' + message.room_code);
    }
    else {
      message = err;
      var options = {
        url: config.get_users,
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
            data[i].created_at = moment(data[i].created_at).format('LLL');
            if(data[i].status === 0) {
              data[i].status = 'online';
            }
            else if(data[i].status === 1) {
              data[i].status = 'offline';
            }
            else if(data[i].status === 2) {
              data[i].status = 'busy';
            }
          }
        }
        res.render('meetings/create', { data: {
                                title: "BK Media | Schedule",
                                page: 'meeting',
                                host: config.HOST,
                                message: {
                                  data: message,
                                  type: "error"
                                },
                                user: req.session.user.data,
                                item: data
                              }
                        });
      });
    }
  });
};


exports.index_management = function(req, res, next) {
  var options = {
    url: config.get_all_meetings,
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
        data[i].link = config.HOST + "rooms/" + data[i].link;
      }
    }
    else {
      message = err;
    }
    res.render('meetings/index_management', { data: {
                            title: 'BK Media | Meetings',
                            page: 'meeting',
                            tab: 'upcomming',
                            meeting: data,
                            host: config.HOST,
                            previous_meeting: [],
                            schedule_meeting: [],
                            user: req.session.user.data
                          }
                        });
  });
};

exports.get_all_upcomming_meeting = function(req, res, next) {
  var options = {
    url: config.get_all_meetings,
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
        data[i].link = config.HOST + "rooms/" + data[i].link;
      }
    }
    else {
      message = err;
    }
    res.render('meetings/index_management', { data: {
                            title: 'BK Media | Meetings',
                            page: 'meeting',
                            tab: 'upcomming',
                            meeting: data,
                            host: config.HOST,
                            previous_meeting: [],
                            schedule_meeting: [],
                            user: req.session.user.data
                          }
                        });
  });
};

exports.get_all_previous_meeting = function(req, res, next) {
  var options = {
    url: config.all_previous_meetings,
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
    res.render('meetings/index_management', { data: {
                            title: 'BK Media | Meetings',
                            page: 'meeting',
                            tab: 'previous',
                            host: config.HOST,
                            meeting: [],
                            previous_meeting: data,
                            schedule_meeting: [],
                            user: req.session.user.data
                          }
                        });
  });
};

exports.get_all_schedule_meeting = function(req, res, next) {
  var options = {
    url: config.all_schedule_meetings,
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
    res.render('meetings/index_management', { data: {
                            title: 'BK Media | Meetings',
                            page: 'meeting',
                            tab: 'schedule',
                            host: config.HOST,
                            meeting: [],
                            previous_meeting: [],
                            schedule_meeting: data,
                            user: req.session.user.data
                          }
                        });
  });
};

exports.room_detail = function(req, res, next) {
  var room_code = req.params.meeting_id || '';

  if(room_code === '') {
    res.render('meetings/index_management', { data: {
                            title: 'BK Media | Meetings',
                            page: 'meeting',
                            tab: 'upcomming',
                            meeting: data,
                            host: config.HOST,
                            previous_meeting: [],
                            schedule_meeting: [],
                            user: req.session.user.data
                          }
                        });
  }

  var options = {
    url: config.get_room + '/' + room_code,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.session.user.token
    }
  };

  request.get(options, function(err, response, body) {
    var message = "";
    if(!err && response.statusCode == 200) {
      var data = JSON.parse(body).success.data;
      data.started_at = moment(data.started_at).format('LLL');
      data.created_at = moment(data.created_at).format('LLL');
      data.updated_at = moment(data.updated_at).format('LLL');
      data.link = config.HOST + "rooms/" + data.link;
      res.render('meetings/detail_management', { data: {
                              title: 'BK Media | Meetings',
                              page: 'meeting',
                              message: message,
                              host: config.HOST,
                              item: data,
                              user: req.session.user.data
                            }
                          });
    }
    else {
      message = err;
      res.render('meetings/detail_management', { data: {
                              title: 'BK Media | Meetings',
                              page: 'meeting',
                              message: message,
                              host: config.HOST,
                              user: req.session.user.data
                            }
                          });
    }

  });
};
