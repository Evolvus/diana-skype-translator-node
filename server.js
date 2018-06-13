var restify = require('restify');
var builder = require('botbuilder');
var axios = require('axios');

//const appId = process.env.MicrosoftAppId || 'c718e84f-a303-4787-850d-e53f1928a804';
//const appPassword = process.env.MicrosoftAppPassword || 'tdfHHOXL5{(%*zsnqUQ7011';
const appId = 'b26ee976-6431-4667-8f78-e970db44fe07';
const appPassword = 'amitdk*636';
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
    
   // console.log("session >>??",session);
    console.log(`Calling NLP Serice : ${dianaNlpUrl}?query=${session.message.text}`);

    axios.post(`${dianaNlpUrl}?query=${session.message.text}`)
        .then(function (response) {
            const body = response.data.body;
            const msgResponse = prepareResponse(body);
            console.log("Response Sending ",msgResponse);
            console.log("Response Sending JSON content",msgResponse.attachments[0].content);
            session.send(JSON.parse(JSON.stringify(msgResponse)));
            //session.send(testBtn());
        }).catch(function (error) {
            console.log("ERROR", error);
            session.send("Something went wrong...come back later !!");
        });





});



function testBtn(){
    return {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "message",
        "text":"helllllo",
        //"speak":speechText, 
        "attachments": [{
            "contentType": "application/vnd.microsoft.card.adaptive",
            "content": {
                "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": 2,
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Tell us about yourself",
                                "weight": "bolder",
                                "size": "medium"
                            },
                            {
                                "type": "TextBlock",
                                "text": "We just need a few more details to get you booked for the trip of a lifetime!",
                                "isSubtle": true,
                                "wrap": true
                            },
                            {
                                "type": "TextBlock",
                                "text": "Don't worry, we'll never share or sell your information.",
                                "isSubtle": true,
                                "wrap": true,
                                "size": "small"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Your name",
                                "wrap": true
                            },
                            {
                                "type": "Input.Text",
                                "id": "myName",
                                "placeholder": "Last, First"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Your email",
                                "wrap": true
                            },
                            {
                                "type": "Input.Text",
                                "id": "myEmail",
                                "placeholder": "youremail@example.com",
                                "style": "email"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Phone Number"
                            },
                            {
                                "type": "Input.Text",
                                "id": "myTel",
                                "placeholder": "xxx.xxx.xxxx",
                                "style": "tel"
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": 1,
                        "items": [
                            {
                                "type": "Image",
                                "url": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Diver_Silhouette%2C_Great_Barrier_Reef.jpg",
                                "size": "auto"
                            }
                        ]
                    }
                ]
            }
        ],
        "actions": [
            {
                "type": "Action.Submit",
                "title": "Submit"
            },
            {
                "type": "Action.Submit",
                "title": "Hello",
                "data":{
                    "type":"string"
                }
            }
        ]
            }
        }]
    };
}


function prepareResponse(standardResponse) {


    switch (standardResponse.type) {

        case 'SIMPLE':
            return {
                "type": "message",
                "text": standardResponse.displayText[getRandomInt(standardResponse.displayText.length)]
            };

        case 'RICH':
            console.log('Response is RICH <><><>', standardResponse.displayText[getRandomInt(standardResponse.displayText.length)]);

            // var speechText = '';
            // for(var i=0;i<standardResponse.speechText.length;i++){
            //     speechText = speechText+ '\n'+standardResponse.speechText[i];
            // }

            var richResponse = {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "message",
                "text": standardResponse.displayText[0],
                //"speak":speechText, 
                "attachments": [{
                    "contentType": "application/vnd.microsoft.card.adaptive",
                    "content": {
                        "type": "AdaptiveCard",
                        "version": "1.0",
                        "body": [],
                        "actions": []
                    }
                }]
            };

            if (standardResponse.displayText && standardResponse.displayText.length > 0) {
                for (var index = 0; index < standardResponse.displayText.length; index++) {
                    richResponse.attachments[0].content.body.push({
                        "type": "TextBlock",
                        "text": `${standardResponse.displayText[index]}`,
                        "wrap": "true",
                        "spacing": "large",
                        "separator":"true"
                    });
                }
            }

            if (standardResponse.buttons && standardResponse.buttons.length > 0) {
                for (var index = 0; index < standardResponse.buttons.length; index++) {
                    richResponse.attachments[0].content.actions.push({
                        "type": "Action.Submit",
                        "title": `${standardResponse.buttons[index].name}`,
                        "data": `${standardResponse.buttons[index].value}`
                    });
                }
            }


            if (standardResponse.images && standardResponse.images.length > 0) {
                for (var index = 0; index < standardResponse.images.length; index++) {
                    richResponse.attachments[0].content.body.push({
                        "type": "Image",
                        "url": `${standardResponse.images[index].url}`,
                        "size": "big",
                        "spacing": "large",
                        "selectAction": {
                            "type": "Action.OpenUrl",
                            "title": `Screenshot${index}`,
                            "url": `${standardResponse.images[index].url}`
                        }

                    });
                }
            }

            return richResponse;

        default:
            return "Sorry something went wrong";


    }


}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}