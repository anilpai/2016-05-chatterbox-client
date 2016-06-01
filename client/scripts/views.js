App.Views = function(thiz){
  var RoomDropdownView = thiz.RoomDropdownView = function(rooms, selected){
    var thiz = {};

    var s = $('<select />');


    thiz.render = function(){
      for(var i = 0; i < rooms.length; i++) {
          $('<option />', {value: rooms[i], text: rooms[i]}).appendTo(s);
      }
      if (selected){
        s.val(selected);
      }
      return s;
    };

    s.change(function(){
      app.fetch(this.selectedOptions[0].value);
    });

    return thiz;
  };
  var ChatsView = thiz.ChatsView = function(chats){
    var self = {};
     thiz.render = function(){
       var toRet = "";
      for(var i = 0; i < chats.length; i++){
        toRet += (new ChatView(chats[i])).render();
      }
      return toRet;
    };
    return thiz;
  };
  var ChatView = thiz.ChatView = function(chat){

    var thiz = {};


    var usernameDiv = "<div class='username'>"+chat.username+"</div>";
    var messageDiv = "<div class='message'>"+chat.text+"</div>";
    var template = "<div id='"+chat.objectId+"' class='messageBlock'>"+usernameDiv+messageDiv+"</div>";

    thiz.render = function(){
      return template;
    };
    return thiz;
  };
};
