App.Views = function(thiz){
  var RoomDropdownView = thiz.RoomDropdownView = function(chats, selected){
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
  var ChatsView = thiz.ChatsView = function(chats){
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
