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
  // app.fetch();
  var messages = new Messages();
  var messagesView = new MessageBoard({model: messages}); 
}

// app.fetch = function() {
//     var data = $.ajax({
//     url: 'https://api.parse.com/1/classes/chatterbox',
//     type: 'GET',
//     contentType: 'application/json',
//     dataType: 'JSON',
//     success: function (data) {
//       console.log('chatterbox: OK ');
//       console.log(data.results);

//       var messages = new Messages(data.results);
//       var messagesView = new MessageBoard({model: messages});    
//     }
//   });
// }

// app.send = function(message) {
//   $.ajax({
//     // This is the url you should use to communicate with the parse API server.
//     url: 'https://api.parse.com/1/classes/chatterbox',
//     type: 'POST',
//     data: JSON.stringify(message),
//     contentType: 'application/json',
//     success: function (data) {
//       console.log('chatterbox: Message sent');
//     },
//     error: function (data) {
//       console.error('chatterbox: Failed to send message');
//     }
//   });
// }


/* BACKBONE */
// model
var Message = Backbone.Model.extend({
});
// collection of model
var Messages = Backbone.Collection.extend({
  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox',
  parse: function(response){
    return response.results
  },
  sync: function(method, model, options){
    var that = this;
    var params = _.extend({
      type: 'GET',
      dataType: 'JSON',
      url: that.url
    }, options);
    return $.ajax(params)
  }
});
// view of collection
var MessageBoard = Backbone.View.extend({
  // keeps track of the changes
  initialize: function(){
    var that = this;
    this.collection = new Messages();
    var data = this.collection.fetch({
        success: function(collection, response, options){
          console.log('beep', data);
        },
        error: function() {
          console.log('error')
        }
    });

    // console.log(this.collection.fetch());

    // json 
    // _.each(data) { item}
    // return JSON.stringify(model)

    //  on success, each loop to return render for each object

    // this.model.on('change', function(){
    //   this.render()
    // }, this)
  },
  // runs when the values are changed and prepends it to our html
  render: function(){
    // console.log(this.model.get('text'));
    // console.log('rendering');
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




