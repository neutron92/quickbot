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

import {
    CreateUser
} from '../../../api/users/methods.js';


import './register.less';
import './register.html';

Template.register.onCreated(function() {
    Meteor.subscribe('users');
    Meteor.subscribe('bots');
    Meteor.subscribe('answers');
    Meteor.subscribe('intents');
    Meteor.subscribe('sentences');
    Meteor.subscribe('messages');
    Meteor.subscribe('chats');
    Meteor.subscribe('histories');
});

Template.register.onRendered(function() {
    $('body').addClass('bg-gray');
    $("#register-form").validate({
        rules: {
            password: {
                minlength: 6
            },
            confirmpassword: {
                minlength: 6,
                equalTo: "#password"
            }
        },
        messages: {
            email: {
                required: TAPi18n.__('emailrequired'),
                email: TAPi18n.__('validemail')
            },
            password: {
                required: TAPi18n.__('passrequired'),
                minlength: TAPi18n.__('validepass')
            },
            confirmpassword: {
                required: TAPi18n.__('confirmpasspassrequired'),
                minlength: TAPi18n.__('validepass'),
                equalTo: TAPi18n.__('validconfirmpasstopass')
            },
            fullname: { required: TAPi18n.__('fullnamerequired') },
            termspolicy: { required: TAPi18n.__('termspolicyrequired') }
        }
    });
});
Template.register.onDestroyed(function() {

});

Template.register.helpers({

});
Template.register.events({
    'submit #register-form': function(e, tpl) {
        e.preventDefault();

        let email = $("#email").val();
        let password = $("#password").val();
        let fullname = $("#fullname").val();
        var x = CreateUser.call({ email: email, password: password, fullname: fullname }, function(err) {
            if (!err) {
                console.log(x);
                Meteor.loginWithPassword(email, password, function(err2) {

                    if (!err2) {
                        Bert.alert({
                            type: 'info',
                            style: 'growl-top-right',
                            title: TAPi18n.__('welcommsg'),
                            message: fullname,
                            icon: 'fa-smile-o'
                        });
                        FlowRouter.go("/");
                    } else {
                        console.log(err2);
                        Bert.alert({
                            type: 'danger',
                            style: 'growl-top-right',
                            title: TAPi18n.__('error'),
                            message: TAPi18n.__(err2.error + ""),
                            icon: 'fa-times'
                        });
                    }
                });

            } else {
                console.log(err);
                Bert.alert({
                    type: 'danger',
                    style: 'growl-top-right',
                    title: TAPi18n.__('error'),
                    message: TAPi18n.__(err.reason.error + ""),
                    icon: 'fa-times'
                });
            }

        })

    }
});