var app = {}

// initialize the app
app.init = function() {
  var messages = new Messages();
  var messagesView = new MessageBoard({model: messages}); 
}

// various sanitizing functions, because people are assholes
var sanitize = function(input) {
    var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
           // replace(/window/gi, '').
           replace(/<[\/\!]*?[^<>]*?>/gi, '').
           replace(/<style[^>]*?>.*?<\/style>/gi, '').
           replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
      return output;
  };


var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

var tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');

function removeTags(html) {
  var oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
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
  // we need to override Backbone.sync to escape Same Origin Policy
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
    _.bindAll(this, 'render');

    // need to refer to this inside each loop 
    var that = this;
    // build colection 
    this.collection = new Messages();

    // fetch data from server via API and pass results when successful
    this.collection.fetch({
        success: function(items){
          _.each(items.toJSON(), function (item){
            that.render(item);
          })
        }
    });
  },
  // runs when the values are changed and prepends it to our html
  render: function(item){
    if (item !== undefined) {

      // set defaults for values
      item.username = item.username || 'annonomyous'
      item.text = item.text || 'No message'
      item.roomname = item.roomname || 'No Roomname'

      // sanitize values
      for (var key in item) {
        item[key] = sanitize(item[key]);
        item[key] = removeTags(item[key]); 
      }

      // set interpolate for handlebar templating settings via underscore
      _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
      };

      // define underscore template
      var template = _.template('<li><div class="username">{{user}}</div><div class="message">{{message}}</div></li>'); 

      // create output with underscore template & passed values
      var html = template({
        user: item.username,
        message: item.text
      });

      // prepend output html to page
      $('.list').prepend(html);
    }
  }
});

// start app by calling initialize function
app.init();




