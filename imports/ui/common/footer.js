import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { MetisMenu } from 'meteor/onokumus:metismenu';

import "./footer.html";
Template.footer.rendered = function() {

    // FIXED FOOTER
    // Uncomment this if you want to have fixed footer or add 'fixed' class to footer element in html code
    // $('.footer').addClass('fixed');

};