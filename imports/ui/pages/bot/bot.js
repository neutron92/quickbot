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
    ReactiveVar
} from 'meteor/reactive-var';
import {
    TAPi18n
} from 'meteor/tap:i18n';
import {
    Bert
} from 'meteor/themeteorchef:bert';
import {
    Tracker
} from 'meteor/tracker';
import {
    Streamy
} from 'meteor/yuukan:streamy';
import {
    moment
} from 'meteor/momentjs:moment';
import '../../../lib/contextMenu.js';
import { FabricAPI } from '../../../lib/fabric_api.js';
import { _ } from 'meteor/underscore';

import { getBot, updateBotFbSettings, updateBot, userInBot, addHim, changeUserPermission } from '../../../api/bots/methods.js';
import { getIntent, editIntentName, getComponentName } from '../../../api/intents/methods.js';
import { getAnswer, editanswerName } from '../../../api/answers/methods.js';

import { getSentences, removeSentence, CreateSentence } from '../../../api/sentences/methods.js';

import { insertMessage, getMessages, deleteAllMessages } from '../../../api/messages/methods.js';
import { getAllChat, insertChat } from '../../../api/chats/methods.js';


import { getUser, getUsersForInvitation } from '../../../api/users/methods.js';
import { getAllHistories } from '../../../api/histories/methods.js';
import { Session } from 'meteor/session'
import './bot.less';
import './bot.html';

Template.bot.onCreated(function() {
    this.chartApp = new ReactiveVar(false);
    this.itemId = new ReactiveVar(false);
    this.currentUser = new ReactiveVar(false);
    this.intent = new ReactiveVar(false);
    this.answer = new ReactiveVar(false);
    this.sentences = new ReactiveVar(false);
    this.testIntent = new ReactiveVar(false);
    this.addFreindVal = new ReactiveVar(false);
    this.permission = new ReactiveVar(false);
    Meteor.subscribe('users');
    Meteor.subscribe('bots');
    Meteor.subscribe('answers');
    Meteor.subscribe('intents');
    Meteor.subscribe('sentences');
    Meteor.subscribe('messages');
    Meteor.subscribe('chats');
    Meteor.subscribe('histories');

});

Template.bot.onRendered(function() {
    var self = this;
    this.permission.set(this.data.permission());
    $("#left-side").height($(window).height() - $(".navbar-fixed-top").height() - 5);
    //$("#left-side").width($("#left-side").width() - $("#right-side").width() + 30);
    $("#page-wrapper").css("padding", "0");
    $("#page-wrapper").css("min-height", "0");

    $("#test-div").height($(window).height() - $(".navbar-fixed-top").height());
    $("#chat-div").height($("#test-div").height() - 250);
    $("#message-div").height($("#right-side").height() - 350);




    console.log("thiss", this)
    var chartApp = new FabricAPI(document.getElementById("maincanvas"), FlowRouter.getParam("id"), this.permission.get());
    contextMenu.init();
    //  $("#maincanvas").width($(".components-canvas").width() - 1)
    // $("#maincanvas").height($("#left-side").height() - $(".components").height() - 99);
    if (this.permission.get() === "readonly") {

        // $(".canvas-container").width($(".left-side").width()) 
        chartApp.setHeight($(window).height() - 10);
        chartApp.setWidth($("#left-side").width() - 1);
    } else {
        chartApp.setHeight($("#left-side").height() - $(".components").height() - 20);
        chartApp.setWidth($(".components-canvas").width() - 1);
    }

    //canvasSize(document.getElementById("maincanvas"), parseInt($(".components-canvas").width()), parseInt($("#left-side").height() - $(".components").height() - 100));

    var permission = "null";
    Tracker.autorun(function(handle) {
        var bot = getBot.call({ botId: FlowRouter.getParam("id") }, function(err) {
            console.log("getbottracker", err);
        })
        if (bot) {
            if (bot.content) {
                chartApp.importJSON(bot.content);
            } else {
                $(".loading").hide();
            }
            handle.stop();
        } else {
            //  handle.run();
        }

    });

    Streamy.on('import' + FlowRouter.getParam("id"), function(d, s) {
        console.log("Streamy id", d.sid, Streamy.id(), d);
        if (d.sid === Streamy.id()) {
            return;
        }
        chartApp.importJSON(d.data);
    });


    Streamy.on('intentModalClient', function(d, s) {
        //console.log("intentModalClientdata", d.data);
        if (d.sid === Streamy.id()) {
            self.itemId.set(d.data.id);
            if (d.data.class == "bot") {
                if (d.data.dbId) {
                    Tracker.autorun(function(handle) {
                        var answer = getAnswer.call({ id: d.data.dbId }, function(err) {
                            console.log("answer", answer, err);
                            if (!err) {
                                self.answer.set(answer);
                                $("#myModalAnswerBot").modal("show");
                            }
                        })
                        handle.stop();

                    });
                }
            } else {
                if (d.data.dbId) {
                    Tracker.autorun(function(handle) {
                        var intent = getIntent.call({ id: d.data.dbId }, function(err) {

                            console.log("intent", intent, err);
                            if (!err) {
                                self.intent.set(intent);

                                $("#myModalIntentUser").modal("show");
                                console.log("intent  ", self.intent.get());
                            }
                        })

                        handle.stop();

                    });
                }
                /* else {
                                $("#myModalIntentUser").modal("show");
                            }*/

            }
        } else {
            return;
        }


    });

    $("canvas").on("contextmenu", function(e) {
        e.preventDefault();

        contextMenu.setPosition();
        contextMenu.hide();
        var object = chartApp.findTargetAt(e);
        console.log("objectobjectobject", object);
        console.log("contextMenu", contextMenu);
        if (object && (object.class == 'user' || object.class == 'bot')) {
            chartApp.setObjectActive(object);
            contextMenu.data([
                { text: 'Edit', id: 'edit' },
                { text: 'Remove', id: 'removeSvg', divider: true }
            ]);
            contextMenu.show();
        } else {
            chartApp.discardCanvas();
            chartApp.fireCanvasEvent('before:selection:cleared');
            contextMenu.data([
                { text: 'Zoom In', id: 'zoomIn' },
                { text: 'Zoom Out', id: 'zoomOut' }
            ]);
            contextMenu.show();
        }
        return false;
    });
    $(document).delegate('li#removeSvg, button#removeSvg', 'click', function(e) {
        chartApp.removeSVG();
        contextMenu.hide();
    });
    $(document).delegate('li#zoomIn, button#zoomIn', 'click', function(e) {
        chartApp.stopCanvasMove();
        chartApp.zoomIn();
        contextMenu.hide();
    });
    $(document).delegate('li#zoomOut, button#zoomOut', 'click', function(e) {
        chartApp.stopCanvasMove();
        chartApp.zoomOut();
        contextMenu.hide();
    });


    this.chartApp.set(chartApp);
    setTimeout(function() {
        Streamy.emit('userConnectBot', {
            userId: Meteor.userId(),
            botId: FlowRouter.getParam("id"),
            connectionId: Meteor.connection._lastSessionId
        });
    }, 350);

});
Template.bot.onDestroyed(function() {
    $("#page-wrapper").css("padding-left", "15px")
    $("#page-wrapper").css("padding-right", "15px")
    $("#page-wrapper").css("min-height", "100vh");
});

Template.bot.helpers({
    bot: function() {
        return getBot.call({ botId: FlowRouter.getParam("id") }, function(err) {
            console.log("getbothelper", err);
        })
    },
    onLine: function(cnx) {
        console.log("cnxcnx", cnx);
        return cnx > 0;
    },
    addCurrentUserColor: function(user) {
        if (user.id == Meteor.userId()) {
            Template.instance().currentUser.set(user)
        }
    },
    CurrentUser: function(user) {
        if (Template.instance().currentUser.get()) {
            return Template.instance().currentUser.get()
        }

    },
    getUserColor: function(id) {
        if (id) {
            var currentBot = getBot.call({ botId: FlowRouter.getParam("id") }, function(err) {
                console.log("getbothelper", err);
            })
            if (currentBot && currentBot.users) {

                for (var index = 0; index < currentBot.users.length; index++) {
                    var element = currentBot.users[index];
                    if (element.id == id) {
                        return element.color
                    }

                }

            }

        }

    },
    categoryName: function(str) {
        if (str == "general") {
            return TAPi18n.__('general');
        } else if (str == "commerce") {
            return TAPi18n.__('commerce');
        } else if (str == "medical") {
            return TAPi18n.__('medical');
        } else if (str == "sport") {
            return TAPi18n.__('sport');
        } else if (str == "news") {
            return TAPi18n.__('news');
        } else if (str == "humor") {
            return TAPi18n.__('humor');
        } else {

        }
    },
    ownerName: function(id) {
        if (getUser.call({ id: id })) {
            return getUser.call({ id: id }).profile.fullname;
        }

    },
    intent: function() {
        return Template.instance().intent.get();

    },
    answer: function() {
        return Template.instance().answer.get();

    },
    sentences: function(id) {
        if (id) {
            return getSentences.call({ id: id }, function(err) {
                console.log("helpersentences", err);
                if (!err) {


                }
            })
        }


    },
    messages: function() {

        return getMessages.call({ botId: FlowRouter.getParam("id") }, function(err) {
            console.log("helpermessages", err);
            if (!err) {


            }
        })



    },
    testIntent: function() {
        return Template.instance().testIntent.get();

    },
    getChats: function() {
        console.log("helperchat");
        return getAllChat.call({ botId: FlowRouter.getParam("id") }, function(err) {
            console.log("helperchat", err);
            if (!err) {


            }
        })
    },
    getDate: function(str) {
        console.log("moment(str)", moment(str).format("DD-MM-YYYY"));
        return moment(str).format("DD-MM-YYYY HH:mm")

    },
    isCategory: function(str, str2) {

        return str == str2

    },
    people: function(str) {
        if (str && str !== "") {
            console.log("str people", str)
            var users = getUsersForInvitation.call({ emailOrName: str }, function(err) {
                if (err) {
                    console.log("err people", err)
                }
            });
            console.log("users people", users)
            return users;
        } else {
            return false
        }
    },
    peopleArray: function(str) {
        console.log("str peopleArray", str);
        if (str && str !== "") {
            console.log("str peopleArray", str);
            var users = getUsersForInvitation.call({ emailOrName: str }, function(err) {
                if (err) {
                    console.log("err peopleArray", err);
                }
            });
            console.log("users peopleArray", users);
            if (Array.isArray(users)) {
                return true;
            } else {
                return false;
            }

        } else {
            return false
        }
    },
    peopleUsers: function(str) {
        if (str && str !== "") {
            console.log("str peopleUsers", str)
            var users = getUsersForInvitation.call({ emailOrName: str }, function(err) {
                if (err) {
                    console.log("err peopleUsers", err);
                }
            });
            // console.log("users peopleUsers", users)
            if (users === "notemail") {
                return TAPi18n.__('addavalideamil');
            } else {
                return false;
            }

        } else {
            //return "false"
        }
    },
    addFreindVal: function() {
        if (Template.instance().addFreindVal.get()) {
            return Template.instance().addFreindVal.get();
        }

    },
    userIsIn: function(id, id2) {
        if (id && id2) {
            return userInBot.call({ userId: id, botId: id2 }, function(err) {
                if (err) {
                    console.log("err userIsIn", err);
                }
            });
        }
    },
    userState: function(str) {
        //console.log("str userState", str)
        if (str === "edit" || str === "readonly" || str === "collaborator" || str === "pending" || str === "admin") {
            return TAPi18n.__(str);
        }
    },
    isSelectedPerm: function(str1, str2) {
        return str1 === str2;
    },
    userPermission: function() {
        var bot = getBot.call({ botId: FlowRouter.getParam("id") }, function(err) {
            console.log("getbottrackerselect", err);
        });
        var users2 = bot.users;
        for (var index = 0; index < users2.length; index++) {
            var element = users2[index];
            if (element.id === Meteor.userId()) {
                Template.instance().permission.set(element.permission);
            }

        }
        if (Template.instance().chartApp.get()) {


            if (Template.instance().permission.get() === "readonly") {

                // $(".canvas-container").width($(".left-side").width()) 
                Template.instance().chartApp.get().setHeight($(window).height() - 10);
                Template.instance().chartApp.get().setWidth($("#left-side").width() - 1);
            } else {
                Template.instance().chartApp.get().setHeight($("#left-side").height() - $(".components").height() - 20);
                Template.instance().chartApp.get().setWidth($(".components-canvas").width() - 1);
            }
        }
        $("#left-side").height($(window).height() - $(".navbar-fixed-top").height() - 5);
        //$("#left-side").width($("#left-side").width() - $("#right-side").width() + 30);
        $("#page-wrapper").css("padding", "0");
        $("#page-wrapper").css("min-height", "0");

        $("#test-div").height($(window).height() - $(".navbar-fixed-top").height());
        $("#chat-div").height($("#test-div").height() - 250);
        $("#message-div").height($("#right-side").height() - 350);
        return Template.instance().permission.get();
    },
    isReadOnly: function(permission) {
        //console.log("permissionpermissionpermission", permission);
        return permission == "readonly";
    },
    isAdmin: function(permission) {
        return permission == "admin";
    },
    isCollaborator: function(permission) {
        return permission == "collaborator";
    },
    isEdit: function(permission) {
        return permission == "edit";
    },
    isAdminOrEdit: function(permission) {
        return permission == "admin" || permission == "edit";
    },
    ReadOnlyClass: function(permission) {
        if (permission == "readonly") {
            return "col-md-12";
        } else {
            return "col-md-9";
        }
    },
    thisUserIsAdmin: function(str, permission) {
        return str == "admin" && permission !== "admin";
    },
    Histories: function() {
        return getAllHistories.call({ botId: FlowRouter.getParam("id") }, function(err) {
            if (err) {
                console.log("err Histories", err);
            }
        });
    },
    getAction: function(action) {
        console.log("actionactionaction", action);
        return TAPi18n.__(action);
    },
    getComponentName: function(id) {
        return getComponentName.call({ id: id }, function(err) {
            console.log("err getComponentName", err);
        });
    },
    isUnDef: function(str) {
        console.log("isUnDefisUnDefisUnDef", str);
        if (str) {
            return true;
        } else {
            return false;
        }
    },
    isChecked: function(type, type2) {
        if (type == type2) {
            return "checked";
        } else {
            return;
        }
    },
    isDisplayed: function(type, type2) {
        if (type == type2) {
            return "display:block";
        } else {
            return "display:none";
        }
    }

});
Template.bot.events({
    "click .component-item": function(e, t) {
        console.log("ttttt", t);
        if (t.permission.get() !== "readonly") {
            var chartApp = t.chartApp.get();
            console.log(chartApp);
            var src = $(e.currentTarget).attr('src');

            chartApp.addSvg(src);
        }
    },
    "click #expand-option": function(e, t) {
        if (t.permission.get() !== "readonly") {
            var chartApp = t.chartApp.get();
            if ($(".components").hasClass("expanded")) {
                $(".components").removeClass("expanded");
                $(".components").show();
                chartApp.setHeight($("#left-side").height() - $(".components").height() - 99);
            } else {
                $(".components").addClass("expanded");
                $(".components").hide();
                chartApp.setHeight($("#left-side").height());
            }


        }

    },
    "click #move-canvas-option": function(e, t) {
        if (t.permission.get() !== "readonly") {
            var chartApp = t.chartApp.get();

            if ($("#move-canvas-option").hasClass("moving")) {
                $("#move-canvas-option").removeClass("moving");
                chartApp.stopCanvasMove();
            } else {
                $("#move-canvas-option").addClass("moving");
                chartApp.startCanvasMove();
            }
        }
    },
    "click #zoom-minus": function(e, t) {
        var chartApp = t.chartApp.get();
        chartApp.zoomOut();
    },
    "click #zoom-plus": function(e, t) {
        var chartApp = t.chartApp.get();
        chartApp.zoomIn();
    },
    "click #zoom-reset": function(e, t) {
        var chartApp = t.chartApp.get();
        chartApp.zoomReset();
    },
    "click #undo-option": function(e, t) {
        if (t.permission.get() !== "readonly") {
            var chartApp = t.chartApp.get();
            chartApp.undo();
        }
    },
    "click #redo-option": function(e, t) {
        if (t.permission.get() !== "readonly") {
            var chartApp = t.chartApp.get();
            chartApp.redo();
        }
    },
    "click #addIntent": function(e, t) {
        if (t.permission.get() !== "readonly") {
            if ($("#intent").val()) {
                var intentId = editIntentName.call({
                    name: $("#intent").val(),
                    id: t.intent.get()._id,
                }, function(err) {
                    if (!err) {
                        console.log("intentId", intentId);
                        Streamy.emit('ModalsubmitServer', {
                            data: intentId
                        });
                        Bert.alert({
                            type: 'success',
                            style: 'growl-top-right',
                            title: TAPi18n.__('successeditintent'),
                            message: TAPi18n.__("editintent"),
                            icon: 'fa-times'
                        });
                        $("#myModalIntentUser").modal("hide");
                        $("#intent").val("");
                        $("#sentence").val("");
                        $(".sentence-item").remove();
                    } else {
                        console.log("editIntentName", err);
                    }
                });
            } else {
                Bert.alert({
                    type: 'warning',
                    style: 'growl-top-right',
                    title: TAPi18n.__('addIntentplz'),
                    icon: 'fa-times'
                });
            }

        }
    },
    "click .closeAddIntent": function(e, t) {
        if (t.permission.get() !== "readonly") {
            // $("#intent").val("");
            $("#sentence").val("");
            $(".sentence-item").remove();
            $("#myModalIntentUser").modal("hide");
        }
    },
    "click #addAnswer": function(e, t) {
        if (t.permission.get() !== "readonly") {
            if ($("#answer").val() && $("#name").val()) {
                var intentId = editanswerName.call({
                    text: $("#answer").val(),
                    name: $("#name").val(),
                    id: t.answer.get()._id,
                }, function(err) {
                    if (!err) {
                        Streamy.emit('ModalsubmitServer', {
                            data: intentId
                        });
                        Bert.alert({
                            type: 'success',
                            style: 'growl-top-right',
                            title: TAPi18n.__('successeditanswer'),
                            message: TAPi18n.__("editanswer"),
                            icon: 'fa-times'
                        });
                        $("#myModalAnswerBot").modal("hide");
                        $("#answer").val("");
                    } else {
                        console.log("editIntentName", err);
                    }
                });
            } else {
                Bert.alert({
                    type: 'warning',
                    style: 'growl-top-right',
                    title: TAPi18n.__('nameandanswerarerequired'),
                    icon: 'fa-times'
                });
            }
        }
    },
    "click .closeAddAnswer": function(e, t) {
        if (t.permission.get() !== "readonly") {
            // $("#answer").val("");
            $("#myModalAnswerBot").modal("hide");
        }
    },
    "click #addSentence": function(e, t) {
        if (t.permission.get() !== "readonly") {
            if ($("#sentence").val()) {
                var intentId = CreateSentence.call({
                    text: $("#sentence").val(),
                    intentId: t.intent.get()._id,
                    botId: FlowRouter.getParam("id")
                }, function(err) {
                    if (!err) {
                        /* Streamy.emit('ModalsubmitServer', {
                             data: intentId
                         });*/


                        Bert.alert({
                            type: 'success',
                            style: 'growl-top-right',
                            title: TAPi18n.__('successaddsentence'),
                            message: TAPi18n.__("addsentence"),
                            icon: 'fa-times'
                        });
                        $("#sentence").val("");
                    } else {
                        console.log("editIntentName", err);
                    }
                });
            } else {
                Bert.alert({
                    type: 'warning',
                    style: 'growl-top-right',
                    title: TAPi18n.__('addsentence'),
                    icon: 'fa-times'
                });
            }

        }
    },
    "click .remove-sentense": function(e, t) {
        if (t.permission.get() !== "readonly") {
            var id = $(e.currentTarget).attr('sentence-id');
            var intentId = removeSentence.call({
                id: id
            }, function(err) {
                if (!err) {
                    /* Streamy.emit('ModalsubmitServer', {
                         data: intentId
                     });*/


                    Bert.alert({
                        type: 'success',
                        style: 'growl-top-right',
                        message: TAPi18n.__("removedsentence"),
                        icon: 'fa-times'
                    });
                    $("#sentence").val("");
                } else {
                    console.log("editIntentName", err);
                }
            });
        }
    },
    "click #send-msg": function(e, t) {
        if (t.permission.get() !== "readonly") {
            if ($("#message").val()) {
                var intent = insertMessage.call({
                    text: $("#message").val(),
                    botId: FlowRouter.getParam("id"),
                    userId: Meteor.userId()
                }, function(err) {
                    if (!err) {
                        t.testIntent.set(intent);
                        $("#message").val("");
                    } else {
                        console.log("senderr", err);
                    }
                });
            } else {
                Bert.alert({
                    type: 'warning',
                    style: 'growl-top-right',
                    title: TAPi18n.__('addmessageplz'),
                    icon: 'fa-times'
                });
            }

        }
    },
    "click #delete-msgs": function(e, t) {
        if (t.permission.get() !== "readonly") {
            deleteAllMessages.call({
                botId: FlowRouter.getParam("id"),
            }, function(err) {
                if (!err) {} else {
                    console.log("senderr", err);
                }
            });
        }
    },
    "click #botfbsettings": function(e, t) {
        if (t.permission.get() !== "readonly") {
            updateBotFbSettings.call({
                botId: FlowRouter.getParam("id"),
                fbpageid: $("#pagefbid").val(),
                fbpagetoken: $("#verifytoken").val()
            }, function(err) {
                if (!err) {} else {
                    console.log("senderr", err);
                }
            });
        }
    },
    "click #save-info": function(e, t) {
        if ((t.permission.get() === "admin") || (t.permission.get() === "edit")) {
            if ($("#botname").val() && $("#botcategory").val() && $("#botdescription").val()) {
                updateBot.call({
                    botId: FlowRouter.getParam("id"),
                    botname: $("#botname").val(),
                    botcategory: $("#botcategory").val(),
                    botdescription: $("#botdescription").val()
                }, function(err) {
                    if (!err) {
                        $("#myModal4").modal("hide");
                    } else {
                        console.log("senderr", err);
                    }
                });
            } else {
                Bert.alert({
                    type: 'warning',
                    style: 'growl-top-right',
                    title: TAPi18n.__('nameandcatanddescriptionarerequired'),
                    icon: 'fa-times'
                });
            }
        }
    },
    "click #send-chat": function(e, t) {
        if (t.permission.get() !== "readonly") {
            if ($("#message-chat").val()) {
                var intent = insertChat.call({
                    text: $("#message-chat").val(),
                    botId: FlowRouter.getParam("id"),
                    userId: Meteor.userId()
                }, function(err) {
                    if (!err) {
                        $("#message-chat").val("");
                    } else {
                        console.log("senderr", err);
                    }
                });
            } else {
                Bert.alert({
                    type: 'warning',
                    style: 'growl-top-right',
                    title: TAPi18n.__('addmessageplz'),
                    icon: 'fa-times'
                });
            }

        }
    },
    "click #expand-btn": function(e, t) {
        if (t.permission.get() !== "readonly") {
            e.preventDefault();
            $(".a-rotation-btn").removeClass("active-item-a");
            if ($("#arrow-btn-expand").hasClass("fa-arrow-left")) {
                /* $("#arrow-btn-expand").removeClass("fa-arrow-left");
                 $("#arrow-btn-expand").addClass("fa-arrow-right");
                 $("#tab-list").addClass("width-tab-list");

                 if ($("#chat-div-tab").hasClass("is-active")) {
                     $("#chat-btn").addClass("active-item-a");
                     console.log('$("#chat-div-tab").hasClass("is-active")', $("#chat-div-tab").hasClass("is-active"));
                 }
                 if ($("#users-div-tab").hasClass("is-active")) {
                     $("#users-btn").addClass("active-item-a");
                 }
                 if ($("#history-div-tab").hasClass("is-active")) {
                     $("#history-btn").addClass("active-item-a");
                 }
                 if ($("#settings-div-tab").hasClass("is-active")) {
                     $("#settings-btn").addClass("active-item-a");
                 }
                 if ($("#generate-div-tab").hasClass("is-active")) {
                     $("#generate-btn").addClass("active-item-a");
                 }*/
            } else {
                $("#arrow-btn-expand").removeClass("fa-arrow-right");
                $("#arrow-btn-expand").addClass("fa-arrow-left");
                $("#tab-list").removeClass("width-tab-list");
                $(".div-content-tab").removeClass("is-active");
            }
        }
    },
    "click #chat-btn": function(e, t) {
        if (t.permission.get() !== "readonly") {
            e.preventDefault();
            $(".a-rotation-btn").removeClass("active-item-a");
            $(".div-content-tab").removeClass("is-active");
            $("#chat-div-tab").addClass("is-active");
            if ($("#chat-btn").hasClass("active-item-a")) {
                if ($("#arrow-btn-expand").hasClass("fa-arrow-left")) {

                } else {
                    $("#arrow-btn-expand").removeClass("fa-arrow-right");
                    $("#arrow-btn-expand").addClass("fa-arrow-left");
                    $("#tab-list").removeClass("width-tab-list");
                }
                $("#chat-btn").removeClass("active-item-a");
            } else {


                if ($("#arrow-btn-expand").hasClass("fa-arrow-left")) {
                    $("#arrow-btn-expand").removeClass("fa-arrow-left");
                    $("#arrow-btn-expand").addClass("fa-arrow-right");
                    $("#tab-list").addClass("width-tab-list");
                } else {
                    if ($("#chat-btn").hasClass("active-item-a")) {
                        $("#arrow-btn-expand").removeClass("fa-arrow-right");
                        $("#arrow-btn-expand").addClass("fa-arrow-left");
                        $("#tab-list").removeClass("width-tab-list");
                        $(".a-rotation-btn").removeClass("active-item-a");
                    } else {
                        console.log("expands");
                    }
                }
                $("#chat-btn").addClass("active-item-a");

            }
        }
    },
    "click #users-btn": function(e, t) {
        if (t.permission.get() !== "readonly") {
            e.preventDefault();
            $(".a-rotation-btn").removeClass("active-item-a");
            $(".div-content-tab").removeClass("is-active");
            $("#users-div-tab").addClass("is-active");
            if ($("#users-btn").hasClass("active-item-a")) {
                if ($("#arrow-btn-expand").hasClass("fa-arrow-left")) {

                } else {
                    $("#arrow-btn-expand").removeClass("fa-arrow-right");
                    $("#arrow-btn-expand").addClass("fa-arrow-left");
                    $("#tab-list").removeClass("width-tab-list");
                }
                $("#users-btn").removeClass("active-item-a");
            } else {


                if ($("#arrow-btn-expand").hasClass("fa-arrow-left")) {
                    $("#arrow-btn-expand").removeClass("fa-arrow-left");
                    $("#arrow-btn-expand").addClass("fa-arrow-right");
                    $("#tab-list").addClass("width-tab-list");
                } else {
                    if ($("#users-btn").hasClass("active-item-a")) {
                        $("#arrow-btn-expand").removeClass("fa-arrow-right");
                        $("#arrow-btn-expand").addClass("fa-arrow-left");
                        $("#tab-list").removeClass("width-tab-list");
                        $(".a-rotation-btn").removeClass("active-item-a");
                    }
                }
                $("#users-btn").addClass("active-item-a");
            }
        }
    },
    "click #history-btn": function(e, t) {
        if (t.permission.get() !== "readonly") {
            e.preventDefault();
            $(".a-rotation-btn").removeClass("active-item-a");
            $(".div-content-tab").removeClass("is-active");
            $("#history-div-tab").addClass("is-active");
            if ($("#history-btn").hasClass("active-item-a")) {
                if ($("#arrow-btn-expand").hasClass("fa-arrow-left")) {

                } else {
                    $("#arrow-btn-expand").removeClass("fa-arrow-right");
                    $("#arrow-btn-expand").addClass("fa-arrow-left");
                    $("#tab-list").removeClass("width-tab-list");
                }
                $("#history-btn").removeClass("active-item-a");
            } else {


                if ($("#arrow-btn-expand").hasClass("fa-arrow-left")) {
                    $("#arrow-btn-expand").removeClass("fa-arrow-left");
                    $("#arrow-btn-expand").addClass("fa-arrow-right");
                    $("#tab-list").addClass("width-tab-list");
                } else {
                    if ($("#history-btn").hasClass("active-item-a")) {
                        $("#arrow-btn-expand").removeClass("fa-arrow-right");
                        $("#arrow-btn-expand").addClass("fa-arrow-left");
                        $("#tab-list").removeClass("width-tab-list");
                        $(".a-rotation-btn").removeClass("active-item-a");
                    }
                }
                $("#history-btn").addClass("active-item-a");
            }
        }
    },
    "click #settings-btn": function(e, t) {
        if (t.permission.get() !== "readonly") {
            e.preventDefault();
            $(".a-rotation-btn").removeClass("active-item-a");
            $(".div-content-tab").removeClass("is-active");
            $("#settings-div-tab").addClass("is-active");
            console.log('$("#settings-btn").hasClass("active-item-a")2', $("#settings-btn").hasClass("active-item-a"));
            if ($("#settings-btn").hasClass("active-item-a")) {
                if ($("#arrow-btn-expand").hasClass("fa-arrow-left")) {

                } else {
                    $("#arrow-btn-expand").removeClass("fa-arrow-right");
                    $("#arrow-btn-expand").addClass("fa-arrow-left");
                    $("#tab-list").removeClass("width-tab-list");
                }
                $("#settings-btn").removeClass("active-item-a");
            } else {


                if ($("#arrow-btn-expand").hasClass("fa-arrow-left")) {
                    $("#arrow-btn-expand").removeClass("fa-arrow-left");
                    $("#arrow-btn-expand").addClass("fa-arrow-right");
                    $("#tab-list").addClass("width-tab-list");
                } else {
                    console.log('$("#settings-btn").hasClass("active-item-a")', $("#settings-btn").hasClass("active-item-a"));
                    if ($("#settings-btn").hasClass("active-item-a")) {
                        $("#arrow-btn-expand").removeClass("fa-arrow-right");
                        $("#arrow-btn-expand").addClass("fa-arrow-left");
                        $("#tab-list").removeClass("width-tab-list");
                        $(".a-rotation-btn").removeClass("active-item-a");
                    }
                }
                $("#settings-btn").addClass("active-item-a");
            }
        }
    },
    "click #generate-btn": function(e, t) {
        if ((t.permission.get() === "admin") || (t.permission.get() === "edit")) {
            e.preventDefault();
            $(".a-rotation-btn").removeClass("active-item-a");
            $(".div-content-tab").removeClass("is-active");
            $("#generate-div-tab").addClass("is-active");
            if ($("#generate-btn").hasClass("active-item-a")) {
                if ($("#arrow-btn-expand").hasClass("fa-arrow-left")) {

                } else {
                    $("#arrow-btn-expand").removeClass("fa-arrow-right");
                    $("#arrow-btn-expand").addClass("fa-arrow-left");
                    $("#tab-list").removeClass("width-tab-list");
                }
                $("#generate-btn").removeClass("active-item-a");
            } else {


                if ($("#arrow-btn-expand").hasClass("fa-arrow-left")) {
                    $("#arrow-btn-expand").removeClass("fa-arrow-left");
                    $("#arrow-btn-expand").addClass("fa-arrow-right");
                    $("#tab-list").addClass("width-tab-list");
                } else {
                    if ($("#generate-btn").hasClass("active-item-a")) {
                        $("#arrow-btn-expand").removeClass("fa-arrow-right");
                        $("#arrow-btn-expand").addClass("fa-arrow-left");
                        $("#tab-list").removeClass("width-tab-list");
                        $(".a-rotation-btn").removeClass("active-item-a");
                    }
                }
                $("#generate-btn").addClass("active-item-a");
            }
        }
    },
    "change #addfriend": function(e, t) {
        if (t.permission.get() !== "readonly") {
            //  e.preventDefault();
            var addFreindVal = $("#addfriend").val();
            t.addFreindVal.set(addFreindVal);
        }

    },
    "keyup #addfriend": function(e, t) {
        if (t.permission.get() !== "readonly") {
            //   e.preventDefault();
            var addFreindVal = $("#addfriend").val();
            t.addFreindVal.set(addFreindVal);
        }

    },
    "keydown #addfriend": function(e, t) {
        if (t.permission.get() !== "readonly") {
            //  e.preventDefault();
            var addFreindVal = $("#addfriend").val();
            t.addFreindVal.set(addFreindVal);
        }

    },
    "click .send-invit-btn": function(e, t) {
        if ((t.permission.get() === "admin") || (t.permission.get() === "edit")) {

            var id = $(e.currentTarget).attr('id');

            var addHimVar = addHim.call({
                botId: FlowRouter.getParam("id"),
                userId: id
            }, function(err) {
                if (!err) {
                    console.log("send-invit-btn addHim", addHimVar);
                } else {
                    console.log("send-invit-btn", err);
                }
            });
        }

    },

    "change .user-perm-select": function(e, tpl) {
        if ((tpl.permission.get() === "admin") || (tpl.permission.get() === "edit")) {
            var id = $(e.currentTarget).attr('id');
            var val = $(e.currentTarget).val();
            var name = $(e.currentTarget).attr('data-name');
            var enable = false;


            swal({
                title: TAPi18n.__('notice'),
                text: TAPi18n.__('aresuretchange') + " " + name + " " + TAPi18n.__('permissionto') + " " + TAPi18n.__(val),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Oui",
                cancelButtonText: "Non",
                closeOnConfirm: true
            }, function(isConfirm) {

                if (isConfirm) {
                    var permission = "readonly";
                    console.log("change user-perm-select", id, val);
                    if (tpl.permission.get() === "admin") {

                        enable = true;


                    } else {
                        if (val === "admin") {
                            enable = false;
                        } else {
                            enable = true;
                        }

                    }
                    if (enable) {
                        changeUserPermission.call({ botId: FlowRouter.getParam("id"), userId: id, permission: val }, function(err) {
                            if (!err) {
                                var bot = getBot.call({ botId: FlowRouter.getParam("id") }, function(err) {
                                    console.log("getbottrackerselect", err);
                                });
                                var users2 = bot.users;
                                for (var index = 0; index < users2.length; index++) {
                                    var element = users2[index];
                                    if (element.id === Meteor.userId()) {
                                        tpl.permission.set(element.permission);
                                    }

                                }

                            } else {
                                console.log("change .user-perm-select err", err);
                            }
                        });
                    } else {
                        console.log("il faut etre un admin");
                    }

                    console.log("confirm tpl.permission", tpl.permission.get());
                } else {

                }
            });
        }

    },
    "click #answerTypeSimple": function(e, t) {
        if (t.permission.get() !== "readonly") {
            if ($("#answerTypeSimple").is(":checked")) {
                $("#simpleAnswer").show();
                $("#genericAnswer").hide();
            }
        }
    },
    "click #answerTypeGeneric": function(e, t) {
        if (t.permission.get() !== "readonly") {
            if ($("#answerTypeGeneric").is(":checked")) {
                $("#genericAnswer").show();
                $("#simpleAnswer").hide();
            }
        }
    },
});