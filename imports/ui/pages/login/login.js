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

import { updateRole } from '../../../api/users/methods.js';

import './login.less';
import './login.html';

Template.login.onCreated(function() {
    Meteor.subscribe('users');
    Meteor.subscribe('bots');
    Meteor.subscribe('answers');
    Meteor.subscribe('intents');
    Meteor.subscribe('sentences');
    Meteor.subscribe('messages');
    Meteor.subscribe('chats');
    Meteor.subscribe('histories');
});

Template.login.onRendered(function() {
    $('body').addClass('bg-gray');
    $("#login-form").validate({
        rules: {
            password: {
                minlength: 6
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
            }
        }
    })
});
Template.login.onDestroyed(function() {

});

Template.login.helpers({

});
Template.login.events({
    'submit #login-form': function(e, tpl) {
        e.preventDefault();

        let email = $("#email").val();
        let password = $("#password").val();
        Meteor.loginWithPassword(email, password, function(err) {
            if (!err) {
                Bert.alert({
                    type: 'info',
                    style: 'growl-top-right',
                    title: TAPi18n.__('welcommsg'),
                    message: Meteor.user().profile.fullname,
                    icon: 'fa-smile-o'
                });
                FlowRouter.go("/");
            } else {
                console.log(err);
                Bert.alert({
                    type: 'danger',
                    style: 'growl-top-right',
                    title: TAPi18n.__('error'),
                    message: TAPi18n.__(err.error + "login"),
                    icon: 'fa-times'
                });
            }
        });

    },
    'click #login-facebook': function(e) {
        e.preventDefault();

        Meteor.loginWithFacebook({ requestPermissions: [] }, function(err) {
            if (err) {
                console.log('Handle errors here: ', err);
            } else {
                console.log('ici ');
                updateRole.call({ id: Meteor.userId(), role: "manager" }, function(err) {
                    if (err) {
                        console.log(': ', err);
                    } else {
                        Bert.alert({
                            type: 'info',
                            style: 'growl-top-right',
                            title: TAPi18n.__('welcommsg'),
                            message: Meteor.user().profile.fullname,
                            icon: 'fa-smile-o'
                        });
                        FlowRouter.go("/");
                    }
                })

            }
        });
    },
    'click #login-twitter': function(e) {
            e.preventDefault();

            Meteor.loginWithTwitter({}, function(err) {
                if (err) {
                    console.log('Handle errors here: ', err);
                } else {
                    //Roles.addUsersToRoles(Meteor.userId(), 'manager', "quickbot");
                    Bert.alert({
                        type: 'info',
                        style: 'growl-top-right',
                        title: TAPi18n.__('welcommsg'),
                        message: Meteor.user().profile.fullname,
                        icon: 'fa-smile-o'
                    });
                    FlowRouter.go("/");
                }
            });
        }
        /*,
            'click #login-google': function(e) {
                e.preventDefault();

                Meteor.loginWithGoogle({ requestPermissions: [] }, function(err) {
                    if (err) {
                        console.log('Handle errors here: ', err);
                    } else {
                        FlowRouter.go("/");
                    }
                });
            }*/
});