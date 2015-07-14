// YOUR CODE HERE:
// https://api.parse.com/1/classes/chatterbox

// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };


// $.ajax({
//   method: 'GET',
//   url: 'https://api.parse.com/1/classes/chatterbox',
//   dataType: 'JSON'
// });

var app = {}
app.init = function() {
  app.fetch();
}

app.fetch = function() {
    var data = $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    dataType: 'JSON',
    success: function (data) {
      console.log('chatterbox: OK ');
      console.log(data.results);

      var messages = new Messages(data.results);
      var messagesView = new MessageBoard({model: messages});    
    }
  });
}

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
}



var Message = Backbone.Model.extend({

  //get all the messages and display all the messages

  initialize: function(data){
    this.set('username', data.username);
    this.set('text', data.text);
    this.set('roomname', data.roomname);
  },
  // execute either d3 or JQuery post request to the parse server with username text and roomname as in the fields
  post: function(){
    console.log('post')
  }
  
});

var Messages = Backbone.Collection.extend({
  model: Message
});


var MessageBoard = Backbone.View.extend({
  // keeps track of the changes
  initialize: function(){
    this.model.on('change', function(){
      this.render()
    }, this)
  },
  // runs when the values are changed and prepends it to our html
  render: function(){
    console.log(this.model.get('text'));
    console.log('rendering');
    // return html .. 
  }
});



app.init();







//$('body').append(messagesView.render());



// var router = Backbone.Router.extend({
//   routes: {
//     'getmessages' : 'getmessages'
//   },
//   getmessages: function(req, res){
//     console.log('getting messages .. ')
//     return $.get('https://api.parse.com/1/classes/chatterbox')
//   }
// });




