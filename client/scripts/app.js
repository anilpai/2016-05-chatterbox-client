var App = function(){
  var thiz = {};

  thiz.$elem = $("#chats");



  thiz.server = 'https://api.parse.com/1/classes/chatterbox';
  thiz.init = function(){

  };
  thiz.chats = [];
  thiz.rooms = [];
  thiz.room = '';

  var refreshDataModel = function(chats,room){
    /*assumes chats is sorted by room*/
    thiz.chats = chats;
    thiz.rooms = _.uniq(_.pluck(chats, 'roomname'));
    if (room){
      thiz.room = room;
    }
  };

  thiz.refreshView = function(){
    var roomDropdownView = thiz.RoomDropdownView(thiz.rooms, thiz.room);

    var chats = thiz.chats;
    if (thiz.room && thiz.room !== ''){
      chats = _.filter(chats,function(elem){
          return elem.roomname === thiz.room;
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
      thiz.chats = [];
      thiz.room = '';
      /*TODO: update view to automatically respond to changes in the data model*/
      thiz.refreshView();
  };

  thiz.fetch = function(roomname){
    $.ajax({
      url: thiz.server,
      type: 'GET',
      data: {'order': '-roomname'},
      contentType: 'application/json',
      success: function (data) {
        refreshDataModel(data.results,roomname);
        thiz.refreshView();
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
