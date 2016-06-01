App.Views = function(thiz){

  var RoomDropdownView = thiz.RoomDropdownView = function(rooms, selected){
    var thiz = {};
    var $elem = $("#roomSelect");

    var wireChangeListener = function(){

      $elem.change(function(){
        console.log('dropdown change fired');
        app.fetch(this.selectedOptions[0].value);
      });
    };

    thiz.initialize = function(){
      /*put stuff that should only be called once here*/
      wireChangeListener();
    };

    thiz.render = function(){
      $elem.html('');
      for(var i = 0; i < rooms.length; i++) {
          $('<option />', {value: rooms[i], text: rooms[i]}).appendTo($elem);
      }
      if (selected){
        $elem.val(selected);
      }
      return $elem;
    };



    return thiz;
  };
  var ChatsView = thiz.ChatsView = function(chats){
    var self = {};
    var $elem = $("#chats");
     thiz.render = function(){
      //  var toRet = "";
      for(var i = 0; i < chats.length; i++){
        $elem.append((new ChatView(chats[i])).render());
      }
      return $elem;
    };
    return thiz;
  };
  var ChatView = thiz.ChatView = function(chat){

    var thiz = {};



    thiz.render = function(){
      var $usernameDiv = $("<div class='username'>"+chat.username+"</div>");

      $usernameDiv.click(function(){
        app.addFriend(chat.username);
      });
      var $messageDiv = $("<div class='message'>"+chat.text+"</div>");

      var $template = $("<div id='"+chat.objectId+"' class='messageBlock'></div>");
      $template.append($usernameDiv,$messageDiv);
      return $template;
    };
    return thiz;
  };
  /*added here so that the events only get wired up once. Shouldn't need these once
  we have events in the model *grumble grumble**/
  RoomDropdownView().initialize();
};
