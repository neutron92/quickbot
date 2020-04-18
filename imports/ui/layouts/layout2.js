import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { MetisMenu } from 'meteor/onokumus:metismenu';

import "./layout2.html";
Template.layout2.rendered = function() {

    // Add special class for handel top navigation layout
    $('body').addClass('top-navigation');

}

Template.layout2.destroyed = function() {

    // Remove special top navigation class
    $('body').removeClass('top-navigation');
};