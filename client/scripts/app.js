

var App = function(username){
  var thiz = {};

  thiz.$elem = $("#chats");
  thiz.username = username || 'anonymous';
  thiz.friends = [];


  thiz.server = 'https://api.parse.com/1/classes/chatterbox';
  thiz.init = function(){
    var $form = $("#send");
    var $message = $("#send #message");
    $form.submit(function(){
      thiz.handleSubmit($message.val());
      return false;
    });
  };
  thiz.chats = [];
  thiz.rooms = [];
  thiz.room = '';
  thiz.message = '';

  var refreshDataModel = function(chats,room){
    /*assumes chats is sorted by room*/
    thiz.chats = chats;
    // thiz.rooms = _.uniq(_.pluck(chats, 'roomname'));
    thiz.rooms = _.pluck(chats, 'roomname');
    if (room){
      thiz.rooms.push(room);
      thiz.room = room;
    }
    thiz.rooms = _.uniq(thiz.rooms);
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
    roomDropdownView.render();
    chatsView.render();
  };

  thiz.addMessage = function(message){
    thiz.chats.push(message);
    thiz.refreshView();
  };

  thiz.addRoom = function(room){
    thiz.rooms.push(room);
    thiz.refreshView();
  };

  thiz.addFriend = function(friend){
    console.log("Add Friend Called", friend);
    thiz.friends.push(friend);
    thiz.refreshView();
  };

  thiz.handleSubmit = function(message){
    /*TODO: no roomname selected by default*/
    thiz.send({'roomname':thiz.room,'username': thiz.username,'text':message});
    console.log("handle submit called", message, "username", thiz.username, "roomname", thiz.room);
  };

  thiz.clearMessages = function(){
      thiz.chats = [];
      thiz.room = '';
      /*TODO: update view to automatically respond to changes in the data model*/
      thiz.refreshView();
  };

  thiz.send = function(message){
    console.log("sending a message...",message);
    $.ajax({
      url: thiz.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        /*refresh view so we can see our changes*/
        thiz.fetch(thiz.room);
      },
      error : function (data) {
        console.error("found an error:", data);
      }
    });
  };

  thiz.fetch = function(roomname){
    $.ajax({
      url: thiz.server,
      type: 'GET',
      data: {'order': '-roomname,-created_at'},
      contentType: 'application/json',
      success: function (data) {
        // console.log("example message", data.results[0]);
        refreshDataModel(data.results,roomname);
        thiz.refreshView();
      },
      error : function (data) {
        console.error("found an error:", data);
      }
    });
  };

  App.Views(thiz);
  return thiz;

};

var app = {};
$(document).ready(function(){
  var parseQueryString = function() {

    var str = window.location.search;
    var objURL = {};

    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL;
  };
  var qs = parseQueryString();
   app = App(qs.username);
   app.init();
});
