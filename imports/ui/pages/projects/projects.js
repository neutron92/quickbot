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

import { pathFor } from 'meteor/arillo:flow-router-helpers';

import { Createbot, getBots, deleteBot } from '../../../api/bots/methods.js';

import './projects.less';
import './projects.html';

Template.projects.onCreated(function() {
    this.regex = new ReactiveVar("");
    Meteor.subscribe('users');
    Meteor.subscribe('bots');
    Meteor.subscribe('answers');
    Meteor.subscribe('intents');
    Meteor.subscribe('sentences');
    Meteor.subscribe('messages');
    Meteor.subscribe('chats');
    Meteor.subscribe('histories');
});

Template.projects.onRendered(function() {

});
Template.projects.onDestroyed(function() {

});

Template.projects.helpers({
    myBots: function() {
        return getBots.call({ ownerId: Meteor.userId(), regex: Template.instance().regex.get() })
    },
    isMine: function(id) {
        return id == Meteor.userId()
    }
});
Template.projects.events({
    "click #add-new-bot": function(e, t) {
        e.preventDefault();
        var fullname;
        if (Meteor.user().profile) {
            if (Meteor.user().profile.fullname) {
                fullname = Meteor.user().profile.fullname;
            } else {
                fullname = "";
            }
        } else {
            fullname = "";
        }
        var botId = Createbot.call({
                name: "newBot " + fullname,
                ownerId: Meteor.userId(),
                category: 'general',
                img: '/bot.png',
                description: "newBot Description"
            },
            function(err) {
                if (!err) {
                    Bert.alert({
                        type: 'success',
                        style: 'growl-top-right',
                        title: TAPi18n.__('botcreatedtitle'),
                        // message: TAPi18n.__('botcreatedmsg'),
                        icon: 'fa-smile-o'
                    });
                    FlowRouter.go("new.bot", { id: botId });
                } else {
                    Bert.alert({
                        type: 'danger',
                        style: 'growl-top-right',
                        title: TAPi18n.__('error'),
                        message: TAPi18n.__(err.error + ""),
                        icon: 'fa-times'
                    });
                }

            }
        );
    },
    "keyup #search-input-bots": function(e, t) {
        //  e.preventDefault();

        var text = $("#search-input-bots").val();
        t.regex.set(text);
    },
    "keydown #search-input-bots": function(e, t) {
        //  e.preventDefault();
        var text = $("#search-input-bots").val();
        t.regex.set(text);
    },
    "change #search-input-bots": function(e, t) {
        // e.preventDefault();
        var text = $("#search-input-bots").val();
        t.regex.set(text);
    },
    "click #span-search-bots": function(e, t) {
        e.preventDefault();
        $("#search-input-bots").focus();
    },
    "click .deleteBot": function(e, t) {
        var id = $(e.currentTarget).attr('id');


        swal({
            title: TAPi18n.__('notice'),
            text: TAPi18n.__('aresuretodeleteUser'),
            type: "danger",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
            closeOnConfirm: true
        }, function(isConfirm) {

            if (isConfirm) {
                deleteBot.call({ botId: id }, function(err) {

                    if (!err) {
                        Bert.alert({
                            type: 'success',
                            style: 'growl-top-right',
                            title: TAPi18n.__('botdeleted '),
                            icon: 'fa-smile-o'
                        });
                    } else {
                        Bert.alert({
                            type: 'danger',
                            style: 'growl-top-right',
                            title: TAPi18n.__('bot '),
                            icon: 'fa-smile-o'
                        });
                    }
                });
            } else {

            }
        });
    },
});