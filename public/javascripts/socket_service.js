var socket = null;
var key = "123";
var message_count = 0;
var config = {
                HOST: config_host.host+"/bkrtc",
                ICE_SERVERS: [
                                { url: 'stun:stun-turn.org:3478'},
                                {
                                  url: 'turn:198.23.226.18:3478',
                                  credential: 'bkrtc_test_turn_2016',
                                  username: 'bkrtc_turn'
                                }
                             ]
              };

function init(user_name) {
  var key_param = "username=" + user_name;
  socket = io.connect(config_host.host+"/system", {path: '/videoconference', reconnect: true, query: key_param, forceNew: true});

  socket.on('connect_error', function(err) {
    console.log(err);
  });

  socket.on('connect', function() {
    console.log('init success');
    receive_message();
    on("call_with_friend", function(message) {
      var data_res = JSON.parse(message).data;
      $("#accept").show();
      $("#refuse").show();
      $("#cancel").hide();
      $("#notify_img").attr("src",data_res.from.image);
      $("#notify_call").text(data_res.from.first_name +" "+ data_res.from.last_name + " calling... ");
      $("#user_name_call").text(data_res.from.user_name);
      $("#myModal").modal('show');
      sound_ringing = new Audio(config_host.audio);
      sound_ringing.loop = true;
      sound_ringing.play();
    });
    on("invite_to_room", function(message) {
      var data_res = JSON.parse(message).data;
      console.log(data_res);
      $(".count").text(1);
      var notify = '<a href="#" class="notify_item"><i class="fa fa-users text-aqua"></i>'+data_res.from+' invites you to the room</a>'
      $("#list_notify").append(notify); 
      $(".notify_item").on("click", function() {
        window.location.replace("/rooms/"+data_res.room_name);
      }) 
    });
    on("get_messages_single", function(message) {
      var data_res = JSON.parse(message).data;
      console.log(data_res);
      for(var i = 0; i < data_res.length; i++ ) {
        if(data_res[i].from == user_name) {
          var message_send = '<div class="direct-chat-msg right"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-right">'+data_res[i].from+'</span><span class="direct-chat-timestamp pull-left">'+data_res[i].time+'</span></div><img class="direct-chat-img" src="'+config_host.host+"/"+data_res[i].image+'" alt="Message User Image"><div class="direct-chat-text">'+data_res[i].content+'</div></div>';
          $("#direct-chat-messages").append(message_send); 
        }
        else {
          var message_receive = '<div class="direct-chat-msg"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'+data_res[i].from+'</span><span class="direct-chat-timestamp pull-right">'+data_res[i].time+'</span></div><img class="direct-chat-img" src="'+config_host.host+"/"+data_res[i].image+'" alt="Message User Image"><div class="direct-chat-text">'+data_res[i].content+'</div></div>';
          $("#direct-chat-messages").append(message_receive);
        }
      }
      set_bottom_scroll();
    });
  });
};

function set_init_storage() {
    console.log("set_init_storage");
};

function get_init_storage() {
    console.log("get_init_storage");
};

function disconnect() {
  console.log("disconnect");
};

function on(event_name, callback) {
  socket.on(event_name, function(data) {
    callback(data);
  });
};


//room service
function emit(event_name, data) {
  socket.emit(event_name, data);
};


function connect_server(user_name, bkrtc_service) {
  bkrtc_service.initialize_server_connection();
  bkrtc_service.register(user_name);
};

function reserve_room (room, socket) {
  socket.emit("reserve_room", JSON.stringify({"data":room}));
};

function join_room(room, socket) {
  socket.emit("join_room", JSON.stringify({"data": room}));
};

function left_room(room, socket) {
  socket.emit("left_room", JSON.stringify({"data": room}));
};


// chat direct service
function send_message(data) {
  socket.emit('chat_with_single_user', JSON.stringify({ "data": data }));
};

function receive_message() {
   socket.on('chat_with_single_user', function(message) {
      var data_res = JSON.parse(message).data;
      console.log(data_res);
      $("#direct_name").text(data_res.from.user_name);
      $("#chat-box-bottom").show(500);
      $("#send-message").hide(500);
      var message_receive = '<div class="direct-chat-msg"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'+data_res.from.user_name+'</span><span class="direct-chat-timestamp pull-right">'+formatTime(new Date())+'</span></div><img class="direct-chat-img" src="'+data_res.from.image+'" alt="Message User Image"><div class="direct-chat-text">'+data_res.message+'</div></div>';
      $("#direct-chat-messages").append(message_receive);
      var notify = '<li><a href="#"><div class="pull-left"><img src="'+data_res.from.image+'" class="img-circle" alt="User Image"></div><h4>'+data_res.from.user_name+'<small><i class="fa fa-clock-o"></i>'+formatTime(new Date())+'</small></h4><p style="width:150px; overflow-x: hidden; text-overflow: ellipsis">'+data_res.message+'</p></a></li>';
      message_count++;
      $(".count_message").empty().append(message_count);
      if($("#message_notify").children().length == 0) {
        $("#message_notify").append(notify);
      }
      else {
        $("#message_notify").prepend(notify);
      }
      set_bottom_scroll();
   });
};

function init_room() {
  var bk_peer = bkrtc.create();
  bk_peer.config = config;
  var peer = bkrtc.init(bk_peer, key, {socket: io, path: '/videoconference'});
  if(peer.status === "success") {
    var service = peer.data.stream_media();
    return service;
  }
  return null;
};

function connect_server(user_name, bkrtc_service) {
  bkrtc_service.initialize_server_connection();
  bkrtc_service.register(user_name);
};

function formatTime(date) {
    var time = "";
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    time = day + "/" + month + "/" + year + " | " + hour + ":" + minute;
    return time;
};

function reset_count() {
  $(".count_message").empty().append(0);
}