var restify = require('restify');
var builder = require('botbuilder');
var axios = require('axios');

const appId = process.env.MicrosoftAppId || 'c718e84f-a303-4787-850d-e53f1928a804';
const appPassword = process.env.MicrosoftAppPassword || 'tdfHHOXL5{(%*zsnqUQ7011';
const dianaNlpUrl = process.env.DIANA_NLP_SERVICE_URL || 'https://lit-inlet-30311.herokuapp.com/api/v0.1/diana';

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

    console.log(`${dianaNlpUrl}?query=${session.message.text}`);

    axios.post(`${dianaNlpUrl}?query=${session.message.text}`)
        .then(function (response) {
            console.log("BODY>>",response.body);
            console.log("BODY DISPLAYTEXT>>",response.body.displayText[0]);
            session.send("Hello From bot");
        })
        .catch(function (error) {
            console.log(error);
            session.send(error);
        });





});


function prepareResponse(standardResponse) {

}