App.Views = function(thiz){

  /*shamelessly stolen from http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery*/
  App.Views.htmlEncode = function(value){
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
  };


  var RoomDropdownView = thiz.RoomDropdownView = function(rooms, selected){
    var thiz = {};
    var $elem = $("#roomSelect");

    var wireChangeListener = function(){

      $elem.change(function(){
        console.log('dropdown change fired');
        if(this.selectedOptions[0].value === "addroom"){
          var room_name = prompt('Enter the room name ?');
          if(room_name !== undefined){
            app.addRoom(room_name);
          }
        }else{
        app.fetch(this.selectedOptions[0].value);
      }
      });
    };

    thiz.initialize = function(){
      /*put stuff that should only be called once here*/
      wireChangeListener();
    };

    thiz.render = function(){
      $elem.html('');
      $('<option value="addroom">Add Room</option>').appendTo($elem);
      for(var i = 0; i < rooms.length; i++) {
          var roomVal = App.Views.htmlEncode(rooms[i]);
          $('<option />', {value: rooms[i], text: roomVal}).appendTo($elem);
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
      var isFriend = false;
      for(var i=0;i<app.friends.length; i++){
        if(chat.username === app.friends[i]){
          isFriend = true;
        }
      }



      var $usernameDiv = $("<div class='username'>"+App.Views.htmlEncode(chat.username)+"</div>");

      $usernameDiv.click(function(){
        app.addFriend(chat.username);
      });
      var $messageDiv = $("<div class='message'>"+App.Views.htmlEncode(chat.text)+"</div>");

      var $template = $("<div id='"+chat.objectId+"' class='messageBlock'></div>");
      $template.append($usernameDiv,$messageDiv);

      if(isFriend){
        //$template.prepend("<b>");
        //$template.append("</b>");
        $template.addClass("bold");
      }

      return $template;
    };
    return thiz;
  };
  /*added here so that the events only get wired up once. Shouldn't need these once
  we have events in the model *grumble grumble**/
  RoomDropdownView().initialize();
};
