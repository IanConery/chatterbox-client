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

// var j = $;

var app = {}
// app.$ = function($) {
//   return $;
// }
app.init = function() {
  // app.fetch();
  var messages = new Messages();
  var messagesView = new MessageBoard({model: messages}); 

  var html = messagesView.render();
}


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
    return $.ajax(params);
  }
});
// view of collection
var MessageBoard = Backbone.View.extend({
  // keeps track of the changes
  initialize: function(){
    _.bindAll(this, 'render');
    var that = this;
    this.collection = new Messages();

    // this is ugly, unfortunately change or sync doesn't seem to work as they should
    // setInterval(function(){
      that.collection.fetch({
          success: function(items){
            _.each(items.toJSON(), function (item){
              // console.log(item);
              that.render(item);
            })
          }
          // ,change: function() {
          //   console.log('change fired')
          // }
      });
    // }, 2000)
  },
  // runs when the values are changed and prepends it to our html
  render: function(item){
    if (item !== undefined) {
      console.log(item, item.username, item.text, item.chatroom);
      var rendered = _.template('<%- username %> , <%- text %> , <%- chatroom %>', item);
      $('body').append(rendered);
    }
  }
});

app.init();


// var router = Backbone.Router.extend({
//   routes: {
//     'getmessages' : 'getmessages'
//   },
//   getmessages: function(req, res){
//     console.log('getting messages .. ')
//     return $.get('https://api.parse.com/1/classes/chatterbox')
//   }
// });




