var request    = require('request');
var moment     = require('moment');
var config     = require('../config/config')();

exports.login = function(req, res, next) {
  var user_name = req.body.username || '';
  var pass_word = req.body.password || '';

  if(user_name === '' || pass_word === '') {
    res.render('login', { data: {
                            title: "BK Media",
                            message: "Username or Password is not valid!",
                            host: config.HOST,
                            user: {
                              username: req.body.username,
                              password: req.body.password
                            }
                          }
                        });
  }

  var options = {
    url: config.authenticate,
    headers: {
      'Content-Type': 'application/json'
    },
    form: {
      user_name: user_name,
      pass_word: pass_word
    }
  };
  request.post(options, function(err, response, body) {
    if(!err && response.statusCode == 200) {
      req.session.user = JSON.parse(body).success;
      req.session.user.data.created_at = moment(req.session.user.data.created_at).format('LLL');

      if(req.session.user.data.status === 0) {
        req.session.user.data.status = 'online';
      }
      else if(req.session.user.data.status === 1) {
        req.session.user.data.status = 'offline';
      }
      else if(req.session.user.data.status === 2) {
        req.session.user.data.status = 'busy';
      }

      if(req.session.user.data.role_id === 1) {
        req.session.user.data.role = 'Admin';
      }
      else if(req.session.user.data.role_id === 2) {
        req.session.user.data.role = 'Member';
      }

      res.redirect('/');
    }
    else {
      console.log(err);
      res.render('login', { data: {
                              title: "BK Media",
                              message: "Invalid credentials!",
                              host: config.HOST,
                              user: {
                                username: req.body.username,
                                password: req.body.password
                              }
                            }
                          });
    }
  });
};

exports.get_users = function(req, res, next) {
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
      message ="ok";
    }
    else {
      message = err;
    }
    res.render('users', { data: {
                            title: "BK Media | Users",
                            page: 'users',
                            message: message,
                            host: config.HOST,
                            user: req.session.user.data,
                            item: data
                          }
                    });
  });
};


exports.get_activities = function(req, res, next) {
  var options = {
    url: config.get_activities,
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
        if(data[i].activity_type_id === 1) {
          data[i].activity_icon = "fa fa-users bg-aqua";
        }
        if(data[i].activity_type_id === 2) {
          data[i].activity_icon = "fa fa-users bg-maroon";
        }
        if(data[i].activity_type_id === 3) {
          data[i].activity_icon = "fa fa-sign-in bg-aqua";
        }
        if(data[i].activity_type_id === 4) {
          data[i].activity_icon = "fa fa-sign-in bg-maroon";
        }
        if(data[i].activity_type_id === 5) {
          data[i].activity_icon = "fa fa-rss bg-maroon";
        }
        if(data[i].activity_type_id === 6) {
          data[i].activity_icon = "fa fa-upload bg-blue";
        }
        if(data[i].activity_type_id === 7) {
          data[i].activity_icon = "fa fa-bookmark-o bg-yellow";
        }
        if(data[i].activity_type_id === 8) {
          data[i].activity_icon = "fa fa-phone bg-aqua";
        }
        if(data[i].activity_type_id === 9) {
          data[i].activity_icon = "fa fa-phone bg-maroon";
        }
        if(data[i].activity_type_id === 10) {
          data[i].activity_icon = "fa fa-ban bg-purple";
        }
      }
    }
    else {
      message = err;
    }

    res.render('users/activities', { data: {
                            title: "BK Media | Users",
                            page: 'activities',
                            message: message,
                            host: config.HOST,
                            user: req.session.user.data,
                            item: data
                          }
                    });
  });
};


exports.get_room_this_month = function(req, res, next) {
   var options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.session.user.token
    }
  };
  if(req.session.user.data.user_name == "admin") {
    options.url = config.get_all_meetings;
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
  }
  else {
    options.url = config.get_room_this_month;
    request.get(options, function(err, response, body) {
      var data = [];
      var message = "";

      if(!err && response.statusCode == 200) {
        data = JSON.parse(body).success.data;
        for(var i = 0; i < data.length; i++) {
          data[i].started_at = moment(data[i].started_at).format('LLL');
          if((i%6) === 0){
            data[i].backround_color = "bg-aqua";
          }
          if((i%6) === 1){
            data[i].backround_color = "bg-red";
          }
          if((i%6) === 2){
            data[i].backround_color = "bg-green";
          }
          if((i%6) === 3){
            data[i].backround_color = "bg-yellow";
          }
          if((i%6) === 4){
            data[i].backround_color = "bg-purple";
          }
          if((i%6) === 5){
            data[i].backround_color = "bg-maroon";
          }
        }
      }
      else {
        message = err;
      }
      res.render('index', { data: {
                              title: "BK Media | Dasboard",
                              page: 'home',
                              message: message,
                              host: config.HOST,
                              user: req.session.user.data,
                              item: data
                            }
                      });
    });
  }
  
 
};


exports.update_profile = function(req, res, next) {

  var options = {
    url: config.update_profile,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.session.user.token
    },
    form: req.body
  };
  request.put(options, function(err, response, body) {
    console.log(body);
    var data = [];
    var message = "";
    if(!err && response.statusCode == 201) {
      req.session.user.data.first_name = req.body.first_name;
      req.session.user.data.last_name = req.body.last_name;
      req.session.user.data.phone = req.body.phone;
      req.session.user.data.email = req.body.email;
      req.session.user.data.address = req.body.address;
      message = "success";
    }
    else {
      message = "false";
    }
    res.render('users/profile', { data: {
                            title: "BK Media | Profile",
                            page: 'profile',
                            message: message,
                            host: config.HOST,
                            user: req.session.user.data,
                          }
                    });
  });
};

exports.user_management = function(req, res, next) {
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
      // for(var i = 0; i < data.length; i++) {
      //   data[i].created_at = moment(data[i].created_at).format('LLL');
      //   if(data[i].status === 0) {
      //     data[i].status = 'online';
      //   }
      //   else if(data[i].status === 1) {
      //     data[i].status = 'offline';
      //   }
      //   else if(data[i].status === 2) {
      //     data[i].status = 'busy';
      //   }
      // }
      message ="ok";
    }
    else {
      message = err;
    }
    res.render('user_management', { data: {
                            title: "BK Media | Users",
                            page: 'users',
                            message: message,
                            host: config.HOST,
                            user: req.session.user.data,
                            item: data
                          }
                    });
  });
};

exports.create_user = function(req, res, next) {
  var data = [];
  var options = {
    url: config.create_user,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.session.user.token
    },
    form: req.body
  };

  request.put(options, function(err, response, body) {
    var message = "";
    if(!err && response.statusCode == 201) {
      data = JSON.parse(body).success.data;
      message = "Success";
    }
    else {
      data = JSON.parse(body).error.data;
      message = "False";
    }
    res.render('users/create', { data: {
                            title: "BK Media | Create",
                            page: 'create',
                            message: message,
                            host: config.HOST,
                            user: req.session.user.data,
                          }
                    });
  });
};