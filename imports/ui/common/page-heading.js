import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { MetisMenu } from 'meteor/onokumus:metismenu';

import "./page-heading.html";
Template.pageHeading.helpers({

    // Route for Home link in breadcrumbs
    home: 'dashboard1'

});