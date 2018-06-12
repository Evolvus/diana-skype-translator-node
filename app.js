var restify = require('restify');
var builder = require('botbuilder');

const appId = process.env.MicrosoftAppId | 'c718e84f-a303-4787-850d-e53f1928a804';
const appPassword = process.env.MicrosoftAppPassword | 'tdfHHOXL5{(%*zsnqUQ7011';

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId,
    appPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    //session.send("You said: %s", session.message.text);
    session.send({
        "type": "message",
        "text": "Plain text is ok, but sometimes I long for more...",
        "attachments": [
          {
            "contentType": "application/vnd.microsoft.card.adaptive",
            "content": {
              "type": "AdaptiveCard",
              "version": "1.0",
              "body": [
                {
                  "type": "TextBlock",
                  "text": "Hello World!",
                  "size": "large"
                },
                {
                  "type": "TextBlock",
                  "text": "*Sincerely yours,*"
                },
                {
                  "type": "TextBlock",
                  "text": "Adaptive Cards",
                  "separation": "none"
                }
              ],
              "actions": [
                {
                  "type": "Action.OpenUrl",
                  "url": "http://adaptivecards.io",
                  "title": "Learn More"
                }
              ]
            }
          }
        ]
      });
});