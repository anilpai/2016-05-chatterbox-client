var App = function(){
  var thiz = {};

  thiz.$elem = $("#chats");



  thiz.server = 'https://api.parse.com/1/classes/chatterbox';
  thiz.init = function(){

  };
  thiz.chats = [];
  thiz.rooms = [];

  var message = {
    username: 'shawndrost',
    text: 'trololo',
    roomname: '4chan'
  };

  thiz.refreshView = function(chats, rooms, roomname){
    chats = chats || thiz.chats;
    rooms = rooms || thiz.rooms;

    var roomDropdownView = RoomDropdownView(chats, roomname);
    thiz.rooms = roomDropdownView.roomList;

    if (roomname){
      chats = _.filter(chats,function(elem){
          return elem.roomname === roomname;
        });
    }
    var chatsView = ChatsView(chats);

    thiz.$elem.html('');
    thiz.$elem.append(roomDropdownView.render());
    thiz.$elem.append(chatsView.render());
  };
  thiz.send = function(message){
    $.ajax({
      url: thiz.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
      },
      error : function (data) {
        console.error("found an error:", data);
      }
    });
  };

  thiz.addMessage = function(message){
    thiz.$elem.append(message);
  };

  thiz.clearMessages = function(){
      thiz.refreshView([], thiz.rooms);
  };

  thiz.fetch = function(roomname){
    $.ajax({
      url: thiz.server,
      type: 'GET',
      data: {'order': '-roomname'},
      contentType: 'application/json',
      success: function (data) {
        var chats = thiz.chats = data.results;
        thiz.refreshView(chats, thiz.rooms, roomname);
      },
      error : function (data) {
        console.error("found an error:", data);
      }
    });
  };
  var RoomDropdownView = function(chats, selected){
    var thiz = {};

    thiz.roomList = _.uniq(_.pluck(chats, 'roomname'));

    thiz.roomname = selected;

    var s = $('<select />');


    thiz.render = function(){
      for(var i = 0; i < thiz.roomList.length; i++) {
          $('<option />', {value: thiz.roomList[i], text: thiz.roomList[i]}).appendTo(s);
      }
      if (thiz.roomname){
        s.val(thiz.roomname);
      }
      return s;
    };

    s.change(function(){
      thiz.roomname =  this.selectedOptions[0].value;
      app.fetch(thiz.roomname);
    });

    return thiz;
  };

  var ChatsView = function(chats){
    var self = {};
    // self._template = "";
     thiz.render = function(){
       var toRet = "";
      for(var i = 0; i < chats.length; i++){
        toRet += (new ChatView(chats[i])).render();
      }
      return toRet;
    };
    return thiz;
  };
  var ChatView = function(chat){

    var thiz = {};


    var usernameDiv = "<div class='username'>"+chat.username+"</div>";
    var messageDiv = "<div class='message'>"+chat.text+"</div>";
    var template = "<div id='"+chat.objectId+"' class='messageBlock'>"+usernameDiv+messageDiv+"</div>";

    thiz.render = function(){
      return template;
    };
    return thiz;
  };



  return thiz;
};

var app = {};
$(document).ready(function(){
   app = App();
});
