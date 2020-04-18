import {
    Meteor
} from 'meteor/meteor';
import {
    Template
} from 'meteor/templating';
import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    TAPi18n
} from 'meteor/tap:i18n';
import {
    Bert
} from 'meteor/themeteorchef:bert';
import { _ } from 'meteor/underscore';
import '../../../common/ibox-tools.js';
import { getAllBots, blockBot, unBlockBot } from '../../../../api/bots/methods.js';
import { getUser } from '../../../../api/users/methods.js';

import './bots.less';
import './bots.html';

Template.bots.onCreated(function() {
    Meteor.subscribe('users');
    Meteor.subscribe('bots');
    Meteor.subscribe('answers');
    Meteor.subscribe('intents');
    Meteor.subscribe('sentences');
    Meteor.subscribe('messages');
    Meteor.subscribe('chats');
    Meteor.subscribe('histories');
});

Template.bots.onRendered(function() {

    setTimeout(function() {
        $('#list-bots').DataTable({});
    }, 500);
});
Template.bots.onDestroyed(function() {

});

Template.bots.helpers({
    bots: function() {
        return getAllBots.call({}, function(err) {
            console.log("getbothelper", err);
        })
    },
    ownerName: function(id) {
        if (getUser.call({ id: id })) {
            return getUser.call({ id: id }).profile.fullname;
        }

    }
});
Template.bots.events({
    "click .blockBot": function(e, t) {
        var id = $(e.currentTarget).attr('id');

        swal({
            title: TAPi18n.__('notice'),
            text: TAPi18n.__('aresuretoblockbot'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
            closeOnConfirm: true
        }, function(isConfirm) {

            if (isConfirm) {
                console.log(id)
                var block = blockBot.call({
                    id: id,
                }, function(err) {
                    if (!err) {} else {
                        Bert.alert({
                            type: 'danger',
                            style: 'growl-top-right',
                            title: TAPi18n.__('botBlocked'),
                            icon: 'fa-smile-o'
                        });
                    }
                });

            } else {

            }
        });
    },
    "click .unBlockBot": function(e, t) {
        var id = $(e.currentTarget).attr('id');

        var block = unBlockBot.call({
            id: id,
        }, function(err) {
            if (!err) {} else {
                Bert.alert({
                    type: 'info',
                    style: 'growl-top-right',
                    title: TAPi18n.__('botUnBlocked'),
                    icon: 'fa-smile-o'
                });
            }
        });
    }
});