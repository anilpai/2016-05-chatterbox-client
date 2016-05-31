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

    var roomDropdownView = thiz.RoomDropdownView(chats, roomname);
    thiz.rooms = roomDropdownView.roomList;

    if (roomname){
      chats = _.filter(chats,function(elem){
          return elem.roomname === roomname;
        });
    }
    var chatsView = thiz.ChatsView(chats);

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

  return thiz;
};

var app = {};
$(document).ready(function(){
   app = App();
   App.Views(app);
});
