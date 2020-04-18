import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { MetisMenu } from 'meteor/onokumus:metismenu';

import "./ibox-tools.html";
Template.iboxTools.events({

    'click .collapse-link': function(event) {
        var element = $(event.target);
        var ibox = element.closest('div.ibox');
        var button = element.closest("i");
        var content = ibox.children('.ibox-content');
        content.slideToggle(200);
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        setTimeout(function() {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    },

    'click .close-link': function(event) {
        var element = $(event.target);
        var content = element.closest('div.ibox');
        content.remove();

    },

    'click .fullscreen-link': function(event) {
        var element = $(event.target);
        var ibox = element.closest('div.ibox');
        var button = element.closest("i");
        $('body').toggleClass('fullscreen-ibox-mode');
        button.toggleClass('fa-expand').toggleClass('fa-compress');
        ibox.toggleClass('fullscreen');
        setTimeout(function() {
            $(window).trigger('resize');
        }, 100);

    }
});