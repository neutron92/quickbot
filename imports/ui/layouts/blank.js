import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { MetisMenu } from 'meteor/onokumus:metismenu';

import "./blank.html";
Template.blankLayout.rendered = function() {

    // Add gray color for background in blank layout
    $('body').addClass('gray-bg');

}

Template.blankLayout.destroyed = function() {

    // Remove special color for blank layout
    $('body').removeClass('gray-bg');
};