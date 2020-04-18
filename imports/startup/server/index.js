import './api.js'
import './services.js'

import { updateBotContent, getBot, updateBotUsers } from '../../api/bots/methods.js';
import { addAnswerLink } from '../../api/answers/methods.js';
import { addIntentLink } from '../../api/intents/methods.js';
import {
    Streamy
} from 'meteor/yuukan:streamy';


Streamy.on('savetodb', function(d, s) {
    //   //console.log("data", d); // Will print 'world!'
    updateBotContent.call({
        botId: d.botid,
        content: d.data,
    }, function(err) {
        //console.log("bot add svg err", err);
        if (!err) {
            Streamy.broadcast('import' + d.botid, { sid: Streamy.id(s), data: d.data });
        }
    });
    // On the server side only, the parameter 's' is the socket which sends the message, you can use it to reply to the client, see below
});

Streamy.on('intentModalServer', function(d, s) {
    // //console.log("intentModalServer", d); // Will print 'world!'
    Streamy.broadcast('intentModalClient', { sid: Streamy.id(s), data: d.data });
});



Streamy.on('ModalsubmitServer', function(d, s) {
    //  //console.log("ModalsubmitServerdata", d); // Will print 'world!'
    Streamy.broadcast('ModalsubmitClient', { sid: Streamy.id(s), data: d.data });
});

Streamy.on('addNewlink', function(d, s) {

    if (d.data.class == "bot") {
        var a = addAnswerLink.call({
            id: d.data.id,
            id2: d.data.id2
        }, function(err) {
            //console.log("addAnswerLink1", err);
            if (!err) {
                //console.log(a);
            }
        })
    } else {
        var i = addIntentLink.call({
            id: d.data.id,
            id2: d.data.id2
        }, function(err) {
            //console.log("addAnswerLink2", err);
            if (!err) {
                //console.log(i);
            }
        })
    }

    /* if (d.data.class2 == "user") {
         addIntentLink.call({
             id2: d.data.id,
             svgId2: d.data.svg,
             id: d.data.id2,
             svgId: d.data.svg2
         }, function(err) {
             //console.log("addAnswerLink3", err);

         })
     } else {
         addAnswerLink.call({
             id2: d.data.id,
             svgId2: d.data.svg,
             id: d.data.id2,
             svgId: d.data.svg2
         }, function(err) {
             //console.log("addAnswerLink3", err);

         })
     }*/


    //console.log("d.data", d.data);
});


var users = [],
    lastcnxid;
Meteor.onConnection((connection) => {
    var index = 0,
        cnxId = "";
    //console.log("connection1", connection.id);
    cnxId = connection;
    //console.log("connection2", cnxId.id);
    Streamy.on('userConnectBot', (data, from) => {
        cnxId = "";
        var botId = data.botId;
        var botUsers = getBot.call({ botId: botId }).users;

        for (var i = 0; i < botUsers.length; i++) {
            if (botUsers[i].id == data.userId) {
                index = i;
            }
        }
        cnxId = data.connectionId;
        if (users) {
            users = [];
        }
        console.log(users);
        users.push({ botId: botId, cnx: cnxId, index: index });


        if (botId) {
            if (index >= 0) {
                //console.log("connection3", cnxId, botId, index);
                updateBotUsers.call({ botId: botId, index: index, plus: true })
            }
        }
        //console.log("users", users);
    });
    connection.onClose(function() {

        var index2, botId2, cnx2, cnxId;
        cnxId = connection;

        //console.log("connection", cnxId.id, connection);
        for (var i = 0; i < users.length; i++) {

            if (users[i].cnx == cnxId.id) {
                cnx2 = users[i].cnx;
                index2 = users[i].index;
                botId2 = users[i].botId;
                users.slice(i, 1);
            }
        }
        //console.log("cnx2 ,index2, botId2", cnx2, index2, botId2);
        if (botId2) {
            if (index2 >= 0) {
                updateBotUsers.call({ botId: botId2, index: index2, plus: false })
            }
        }


    });
});


var users = Meteor.users.find({ roles: 'super-admin' })
console.log("users", users.fetch().length);
if (users.fetch().length <= 0) {
    var userid = Accounts.createUser({
        username: 'superadmin',
        email: 'hichemchouaibi123@gmail.com',
        password: 'neutron#Admin2015@Q4',
    });
    // Roles.addUsersToRoles(userid, ['super-admin', 'admin']);
    Meteor.users.update({ _id: userid }, {
        $set: {
            "profile.fullname": "Hichem Chouaibi",
            "profile.gender": "male",
            "profile.birthday": new Date('1992-09-17')
        }
    });
    Meteor.users.update({ _id: userid }, {

        $push: { roles: "admin" }
    });

    Meteor.users.update({ _id: userid }, {

        $push: { roles: "super-admin" }
    });
}