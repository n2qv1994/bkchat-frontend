$("#send-message").on("click", function() {
    if($("#direct_name").text() !== "") {
        $("#chat-box-bottom").show(500);
        $("#send-message").hide(500);
    }
});

$("#close").on("click", function() {
    $("#chat-box-bottom").hide(500);
    $("#send-message").show(500);
});

function chat (user_name_of_friend) {
  $("#direct_name").text(user_name_of_friend);
  $("#chat-box-bottom").show(500);
  $("#send-message").hide(500);
  var data = {
    from : user_name,
    to : user_name_of_friend
  };
  emit("get_messages_single", JSON.stringify({ "data": data }));
};

function call (user_name_called, first_name_called, last_name_called, image_called, user_name, first_name, last_name, image) {

  $("#notify_img").attr("src",image_called);
  $("#notify_call").text("calling... "+ first_name_called +" "+ last_name_called);
  $("#user_name_call").text(user_name_called);
  $("#accept").hide();
  $("#refuse").hide();
  $("#cancel").show();
  var data = {
    from : {
      user_name: user_name,
      first_name: first_name,
      last_name: last_name,
      image: image
    },
    to : user_name_called
  };
  emit("call_with_friend", JSON.stringify({ "data": data }));

}

function send() {
  var data = {
    from: {
      user_name:user_name,
      image: image
    },
    to: $("#direct_name").text(),
    message: $("#text-message").val(),
  };
  var message_send = '<div class="direct-chat-msg right"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-right">'+user_name+'</span><span class="direct-chat-timestamp pull-left">23 Jan 2:05 pm</span></div><img class="direct-chat-img" src="'+image+'" alt="Message User Image"><div class="direct-chat-text">'+$("#text-message").val()+'</div></div>';
  $("#direct-chat-messages").append(message_send); 
  set_bottom_scroll();
  send_message(data);
  $("#text-message").val("");
};

function set_bottom_scroll() {
  var scroll = document.getElementById("direct-chat-messages");
  scroll.scrollTop = scroll.scrollHeight;
};

$('#text-message').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
  	if (keycode == '13') {
		var text_message = $("#text-message");
  		if( text_message.val() === "") {
      		return;
    	}
    	else {
      		send();
  		}
    }
});

 
