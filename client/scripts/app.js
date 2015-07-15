var app = {}
var objectStorage = {}
// initialize the app
app.init = function() {

  var messages = new Messages();
  messages.retrieveMsgs();

  var messagesView = new MessagesView({
    el: $('.list'),
    collection: messages
  });

  var formView = new FormView({
    el: $('#form'),
    // formView needs to have access to the collection to pass new messages directly
    collection: messages
  })

  setInterval(messages.retrieveMsgs.bind(messages), 1000);

}

/* BACKBONE */
// model
var Message = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox',
  defaults: {
    username: '',
    text: ''
  }
});

// collection of model
var Messages = Backbone.Collection.extend({
  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox',
  retrieveMsgs: function() {
    this.fetch({
      // fetch data ordered by creation date.. 
      data: {
        order: '-createdAt'
      }
    });
  },
  parse: function(response, options) {
    var results = [];
    // reverse array to display newest messages on top
    for (var i = response.results.length - 1; i >= 0; i--) {
      results.push(response.results[i]);
    };
    return results;
  }
});

// View of sindle message / model
var MessageView = Backbone.View.extend({
  render: function() {
    var item = this.model.attributes;

    if (!objectStorage[item.objectId]) {
      objectStorage[item.objectId] = item.objectId;
      if (item !== undefined) {

        // sanitize values
        for (var key in item) {
          // make sure item[key] is a truthy value (no null, undefined, etc)
          if (item.hasOwnProperty(key) && item[key]) {
            item[key] = sanitize(item[key]);
            item[key] = removeTags(item[key]);
          }
        }

        // set interpolate for handlebar templating settings via underscore
        _.templateSettings = {
          interpolate: /\{\{(.+?)\}\}/g
        };

        // define underscore template
        var template = _.template('<div class="col-xs-12"><span class="username">{{user}}</span><span class=" message">{{message}}</span></div>');

        // create output with underscore template & passed values
        var html = template({
          user: item.username,
          message: item.text
        });

        objectStorage[item.objectId] = item.objectId;

        return this.$el.html(html);
      }

    }
  }
})

// view of collection
var MessagesView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('sync', this.render, this);
  },
  // runs when the values are changed and prepends it to our html
  render: function() {
    this.collection.forEach(this.renderMessage, this)
  },

  renderMessage: function(message) {
    var messageView = new MessageView({
      model: message
    });
    var html = messageView.render();

    this.$el.prepend(html);
  }
});

var FormView = Backbone.View.extend({

  events: {
    'submit #send': 'executeSubmit'
  },

  executeSubmit: function(e) {
    e.preventDefault();
    var message = {
      text: $('#message').val(),
      username: 'Grinding HR Student'
    }

    //var sendmessage = new Message(message);
    // sendmessage.save();

    // better, because immediately tied to the collection object:
    this.collection.create(message);
  }
})

// start app by calling initialize function
app.init();


/* HELPER FUNCTION */
// various sanitizing functions, because people are assholes
var sanitize = function(input) {
  var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
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
  + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*' + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
  // Regular name
  + '|/?[a-z]' + tagBody + ')>',
  'gi');

function removeTags(html) {
  var oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
}