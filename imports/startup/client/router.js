import {
    FlowRouter
} from 'meteor/kadira:flow-router';
import {
    BlazeLayout
} from 'meteor/kadira:blaze-layout';
import {
    Tracker
} from 'meteor/tracker';

import { HTTP } from 'meteor/http'

import { getBot } from '../../api/bots/methods.js';


/*layouts*/
import "../../ui/layouts/blank.js";
import "../../ui/layouts/main.js";
import "../../ui/layouts/main2.js";

/*pages*/
import "../../ui/pages/login/login.js";
import "../../ui/pages/register/register.js";
import "../../ui/pages/projects/projects.js";
import "../../ui/pages/bot/bot.js";
import "../../ui/pages/admin/bots/bots.js";
import "../../ui/pages/admin/users/users.js";

Meteor.subscribe('users');
Meteor.subscribe('bots');
Meteor.subscribe('answers');
Meteor.subscribe('intents');
Meteor.subscribe('sentences');
Meteor.subscribe('messages');
Meteor.subscribe('chats');
Meteor.subscribe('histories');

FlowRouter.route('/', {
    name: "app.home",
    triggersEnter: [trackRouteEntry],
    action: function() {

        Tracker.autorun(function(handle) {
            if (Meteor.userId()) { // reactive
                if (Meteor.user()) {
                    console.log("user", Meteor.user(), Meteor.user().roles[1] == "admin");
                    if ((Meteor.user().roles[0] == "admin") || (Meteor.user().roles[0] == "super-admin")) {
                        FlowRouter.go('all.projects');
                    } else {
                        FlowRouter.go('user.projects');
                    }
                }
            }
        });
    }
});

FlowRouter.route('/projects', {
    name: "user.projects",
    triggersEnter: [trackRouteEntry, trackRouteEntryUserProjects],
    action: function() {
        BlazeLayout.render("mainLayout", { content: "projects" });
    }
});


FlowRouter.route('/bot/:id', {
    name: "new.bot",
    triggersEnter: [trackRouteEntry, trackRouteEntryBot],
    action: function(params, queryParams) {
        var permission = "readonly";
        Tracker.autorun(function(handle) {
            console.log(params.id);
            var bot = getBot.call({ botId: params.id }, function(err) {
                console.log("getbottrackerwww", err);
            })
            console.log("botbotbotbotwwww", bot);
            if (bot) {
                console.log("botbotbotbot", bot);
                var users2 = bot.users;
                for (var index = 0; index < users2.length; index++) {
                    var element = users2[index];
                    if (element.id === Meteor.userId()) {
                        permission = element.permission;
                    }

                }
                console.log("BlazeLayout", BlazeLayout);
                // BlazeLayout.reset();
                //  BlazeLayout._updateRegions({ content: "bot", permission: permission });
                BlazeLayout.render("mainLayout2", { content: "bot", permission: permission });
                handle.stop();
            } else {
                //FlowRouter.go('user.projects');
            }

        });


    }
});


FlowRouter.route('/admin/projects', {
    name: "all.projects",
    triggersEnter: [trackRouteEntry, trackRouteEntryAdminProjects],
    action: function() {
        BlazeLayout.render("mainLayout", { content: "bots" });
    }
});

FlowRouter.route('/admin/users', {
    name: "all.users",
    triggersEnter: [trackRouteEntry, trackRouteEntryAdminProjects],
    action: function() {
        BlazeLayout.render("mainLayout", { content: "users" });
    }
});


function trackRouteEntry(context) {
    Tracker.autorun(function(handle) {
        if (!Meteor.userId()) { // reactive
            console.log(Meteor.userId());
            var routeName = FlowRouter.current().route.name;
            console.log(FlowRouter.current());
            if ((routeName != "App.login") && (routeName != "App.register") && (routeName != "App.forget") && (routeName != "user.profile.out")) {
                FlowRouter.go('App.login');
                handle.stop();
            }
        }
    });
}

function trackRouteEntryBot(context) {
    Tracker.autorun(function(handle) {
        if (Meteor.userId()) { // reactive
            console.log(Meteor.userId());
            var exist = 0;
            var routeName = FlowRouter.current().route.name;
            var id = FlowRouter.current().params.id;
            console.log(FlowRouter.current());


            Tracker.autorun(function(handle) {
                var botw = getBot.call({ botId: id }, function(err) {
                    console.log("trackRouteEntryBotbot", err);
                })
                if (botw) {
                    var users = botw.users;
                    for (var index = 0; index < users.length; index++) {
                        var element = users[index];
                        if (element.id === Meteor.userId()) {
                            exist++;
                        }

                    }
                    if (exist === 0) {
                        FlowRouter.go('/projects');
                    }
                    handle.stop();
                }

            });
        }
    });
}

function trackRouteEntryAdminProjects(context) {
    Tracker.autorun(function(handle) {
        if (Meteor.user()) { // reactive
            console.log(Meteor.user());


            if ((Meteor.user().roles[0] !== "admin") && (Meteor.user().roles[0] !== "super-admin")) {
                FlowRouter.go('app.home');
                handle.stop();
            }

        }

    });
}


function trackRouteEntryUserProjects(context) {
    Tracker.autorun(function(handle) {
        if (Meteor.user()) { // reactive
            console.log(Meteor.user());


            if (Meteor.user().roles[0] !== "manager") {
                FlowRouter.go('app.home');
                handle.stop();
            }


        }

    });
}




FlowRouter.route('/login', {
    name: "App.login",
    action: function() {
        BlazeLayout.render("blankLayout", { content: "login" });
    }
});

FlowRouter.route('/register', {
    name: "App.register",
    action: function() {
        BlazeLayout.render("blankLayout", { content: "register" });
    }
});