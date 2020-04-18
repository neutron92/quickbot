import {
    Restivus
} from 'meteor/nimble:restivus';

import { HTTP } from 'meteor/http'

import { Bots } from './bots.js';

import { Answers } from '../answers/answers.js';
import { Sentences } from '../sentences/sentences.js';
import { Intents } from '../intents/intents.js';
// Global API Configuration
var Api = new Restivus({
    apiPath: 'api/', // https://yoursite.com/api/routes-to-add/
    useDefaultAuth: true,
    prettyJson: true
});
// Add the 'webhook' route
Api.addRoute('webhook/:id', { authRequired: false }, {
    // Define GET
    get: {
        action: function() {
            // Check the verify token, it has to match with the one you set earlier
            var currentBot = Bots.findOne({
                verify_token: this.queryParams['hub.verify_token']
            });
            //  console.log("currentBot", /*currentBot ,*/ this.queryParams['hub.verify_token']);

            //console.log("currentBot", this);
            if (currentBot._id == this.request.params.id) {
                // The response needs to be a number
                return Number(this.queryParams['hub.challenge']);
            }
            // If the token is wrong, then return something else
            return "Facebook API";
        }
    },
    // Define POST
    post: {
        action: function() {
            // Declare message event
            messaging_events = this.bodyParams.entry[0].messaging;
            //console.log("13", this.request.params.id);
            for (i = 0; i < messaging_events.length; i++) {
                event = this.bodyParams.entry[0].messaging[i];
                sender = event.sender.id;

                console.log("sender", event)
                    // If message exists
                if (event.message && event.message.text) {
                    var text = event.message.text;
                    //console.log("texttext", text);
                    var currentBot = Bots.findOne({
                        _id: this.request.params.id
                    });
                    getUserInfo(event.recipient.id, currentBot.page_token)
                        //    console.log("currentBot", currentBot);
                        // sendGenericMessage(sender, currentBot.page_token);
                    var sentence = Sentences.findOne({ botId: this.request.params.id, text: text })
                        // Check message content
                        // console.log(text);
                    if (sentence && sentence._id) {
                        intent = Intents.findOne({ _id: sentence.intentId })
                        answer = Answers.findOne({ _id: intent.nextAnswerId })
                            //console.log("ahlan", sender)
                        if (text === 'Generic') {
                            // Send generic message (the one with Oculus)
                            //sendGenericMessage(sender, currentBot.page_token);
                        } else {
                            // Send back a response
                            // Use this one to echo a text
                            // sendTextMessage(sender, text.substring(0, 200));
                            sendTextMessage(sender, currentBot.page_token, answer.text);
                        }
                    } else {
                        //sendTextMessage(sender, currentBot.page_token, "did'nt understand");
                    }

                }
            }
            // Status code: success
            return 200;
        }
    }
});


function sendTextMessage(sender, token, text) {
    messageData = {
        text: text
    };

    HTTP.post("https://graph.facebook.com/v2.8/me/messages", {
        params: {
            access_token: token
        },
        data: {
            recipient: {
                id: sender
            },
            message: messageData
        }
    }, function(error, result) {
        if (error) {
            console.log("POST request failed.", error);
        } else {
            console.log("Message sent", result);
        }
    });
}

// Send generic, pre-defined message
/*function sendGenericMessage(sender, token) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Oculus Rift",
                    "subtitle": "The latest VR technology in store",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "default_action": {
                        "type": "web_url",
                        "url": "https://peterssendreceiveapp.ngrok.io/view?item=103"
                    },
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.oculus.com/en-us/",
                        "title": "Visit Store"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Samsung Gear VR",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",

                }]
            }
        }
    };

    HTTP.post("https://graph.facebook.com/v2.8/me/messages", {
        params: {
            access_token: token
        },
        data: {
            recipient: {
                id: sender
            },
            message: messageData
        }
    }, function(error, result) {
        if (error) {
            console.log("POST request failed.", error);
        } else {
            console.log("Generic message sent");
        }
    });
}*/

function getUserInfo(id, token) {

    //console.log(id);
    /*  HTTP.post("https://graph.facebook.com/v2.8/100009786075981", {
          params: {
              access_token: token,
              fields: 'first_name,last_name'
          }
      }, function(error, result) {
          if (error) {
              console.log("POST request failed.", error);
          } else {
              //   console.log("userinfo", result);
          }
      });*/

    HTTP.post("https://graph.facebook.com/v2.8/" + id, {
        params: {
            access_token: token,
            fields: 'from,id,to'
        }
    }, function(error, result) {
        if (error) {
            console.log("POST request failed.", error);
        } else {
            console.log("userinfo", result);
        }
    });
}