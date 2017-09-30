var request    = require('request');
var moment     = require('moment');
var config     = require('../config/config')();

exports.join_room = function(req, res, next) {
       res.render('room', { data: {
                        title: 'BK Media | Meetings',
                        host: config.HOST,
                        user: req.session.user.data,
                        room_name: req.params.meeting_link
                       }
                     });
};

exports.join_direct_room = function(req, res, next) {
 	res.render('room_direct', { data: {
                    title: 'BK Media | Direct Room',
                    host: config.HOST,
                    user: req.session.user.data,
                    peer: req.params.peer
                   }
                 });
};
