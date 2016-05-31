var App = function(){
  var self = {};

  self.$elem = $("#chats");



  self.server = 'https://api.parse.com/1/classes/chatterbox';
  self.init = function(){

  };
  self.chats = [];
  self.rooms = [];

  var message = {
    username: 'shawndrost',
    text: 'trololo',
    roomname: '4chan'
  };

  self.refreshView = function(chats, rooms, roomname){
    chats = chats || self.chats;
    rooms = rooms || self.rooms;

    var roomDropdownView = RoomDropdownView(chats, roomname);
    self.rooms = roomDropdownView.roomList;

    if (roomname){
      chats = _.filter(chats,function(elem){
          return elem.roomname === roomname;
        });
    }
    var chatsView = ChatsView(chats);

    self.$elem.html('');
    self.$elem.append(roomDropdownView.render());
    self.$elem.append(chatsView.render());
  };
  self.send = function(message){
    $.ajax({
      url: self.server,
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

  self.addMessage = function(message){
    self.$elem.append(message);
  };

  self.clearMessages = function(){
      self.refreshView([], self.rooms);
  };

  self.fetch = function(roomname){
    $.ajax({
      url: self.server,
      type: 'GET',
      data: {'order': '-roomname'},
      contentType: 'application/json',
      success: function (data) {
        var chats = self.chats = data.results;
        self.refreshView(chats, self.rooms, roomname);
      },
      error : function (data) {
        console.error("found an error:", data);
      }
    });
  };
  var RoomDropdownView = function(chats, selected){
    var self = {};

    self.roomList = _.uniq(_.pluck(chats, 'roomname'));

    self.roomname = selected;

    var s = $('<select />');


    self.render = function(){
      for(var i = 0; i < this.roomList.length; i++) {
          $('<option />', {value: this.roomList[i], text: this.roomList[i]}).appendTo(s);
      }
      if (this.roomname){
        s.val(this.roomname);
      }
      return s;
    };

    s.change(function(){
      self.roomname =  this.selectedOptions[0].value;
      app.fetch(self.roomname);
    });

    return self;
  };

  var ChatsView = function(chats){
    var self = {};
    // self._template = "";
     self.render = function(){
       var toRet = "";
      for(var i = 0; i < chats.length; i++){
        toRet += (new ChatView(chats[i])).render();
      }
      return toRet;
    };
    return self;
  };
  var ChatView = function(chat){

    var self = {};


    var usernameDiv = "<div class='username'>"+chat.username+"</div>";
    var messageDiv = "<div class='message'>"+chat.text+"</div>";
    var template = "<div id='"+chat.objectId+"' class='messageBlock'>"+usernameDiv+messageDiv+"</div>";

    self.render = function(){
      return template;
    };
    return self;
  };



  return self;
};

var app = {};
$(document).ready(function(){
   app = App();
});
