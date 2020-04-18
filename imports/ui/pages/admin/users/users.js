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
import { getAllusers, deleteUser, addNewAdmin } from '../../../../api/users/methods.js';

import './users.less';
import './users.html';

Template.users.onCreated(function() {
    this.useredit = new ReactiveVar(false);
    Meteor.subscribe('users');
    Meteor.subscribe('bots');
    Meteor.subscribe('answers');
    Meteor.subscribe('intents');
    Meteor.subscribe('sentences');
    Meteor.subscribe('messages');
    Meteor.subscribe('chats');
    Meteor.subscribe('histories');
});

Template.users.onRendered(function() {

    setTimeout(function() {
        $('#list-users').DataTable({});
    }, 500);
});
Template.users.onDestroyed(function() {

});

Template.users.helpers({
    users: function() {
        return getAllusers.call({}, function(err) {
            console.log("getbothelper", err);
        })
    },
    getEmail: function(user) {
        var currentUser = Meteor.users.findOne({
            _id: user._id
        });
        if (currentUser) {
            console.log("currentUser", currentUser);
            if (currentUser.emails) {
                if (currentUser.emails[0]) {
                    if (currentUser.emails[0].address) {
                        return currentUser.emails[0].address
                    }
                } else {
                    return TAPi18n.__('hasnoemail')
                }
            } else {

                if (currentUser.services.facebook) {
                    return TAPi18n.__('Facebook')
                } else {
                    return TAPi18n.__('Twitter')
                }
            }
        }
    },
    isSuperAdmin: function(user) {

        var currentUser = Meteor.users.findOne({
            _id: user._id
        });
        if (currentUser && currentUser.roles) {

            return currentUser.roles[0] == "super-admin"
        }
    },
    getRole: function(user) {

        var currentUser = Meteor.users.find({
            _id: user._id
        }, { fields: { roles: 1 } }).fetch();
        if (currentUser[0] && currentUser[0].roles) {

            return currentUser[0].roles[0]
        }
    },
});
Template.users.events({
    "click .deleteUser": function(e, t) {
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
                console.log(id)
                var block = deleteUser.call({
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
    "click #adduser": function(e, t) {
        var name = $("#name").val();
        var password = $("#password").val();
        var email = $("#email").val();
        if (email) {
            if (password) {
                if (name) {
                    addNewAdmin.call({ email: email, password: password, fullname: name }, function(err) {
                        if (err) {
                            Bert.alert({
                                type: 'danger',
                                style: 'growl-top-right',
                                title: TAPi18n.__('error'),
                                icon: 'fa-smile-o'
                            });

                        } else {
                            Bert.alert({
                                type: 'success',
                                style: 'growl-top-right',
                                title: TAPi18n.__('useradded'),
                                icon: 'fa-smile-o'
                            });
                            $("#name").val("");
                            $("#password").val("");
                            $("#email").val("");
                            $("#myModalAddUser").modal("hide");
                        }
                    });
                } else {
                    Bert.alert({
                        type: 'danger',
                        style: 'growl-top-right',
                        title: TAPi18n.__('namerequired'),
                        icon: 'fa-smile-o'
                    });
                }
            } else {
                Bert.alert({
                    type: 'danger',
                    style: 'growl-top-right',
                    title: TAPi18n.__('passwordrequired'),
                    icon: 'fa-smile-o'
                });
            }
        } else {
            Bert.alert({
                type: 'danger',
                style: 'growl-top-right',
                title: TAPi18n.__('emailrequired'),
                icon: 'fa-smile-o'
            });
        }

    }
});