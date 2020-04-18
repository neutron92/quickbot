import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { MetisMenu } from 'meteor/onokumus:metismenu';

import "./navigation.html";
Template.navigation.rendered = function() {

    // Initialize metisMenu
    $('#side-menu').metisMenu();

};

// Used only on OffCanvas layout
Template.navigation.events({

    'click .close-canvas-menu': function() {
        $('body').toggleClass("mini-navbar");
    }

});

Template.navigation.helpers({
    isAdmin: function() {
        if (Meteor.user()) {
            return Meteor.user().roles[0] !== "manager"
        }

    },
    isNot: function() {
        if (Meteor.user()) {
            return Meteor.user().roles[0] == "manager"
        }

    }
});