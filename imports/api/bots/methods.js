import {
    Meteor
} from 'meteor/meteor';

import {
    ValidatedMethod
} from 'meteor/mdg:validated-method';

import {
    moment
} from 'meteor/momentjs:moment';
import SimpleSchema from 'simpl-schema';

import { Bots } from './bots.js';
import { insertHistory } from '../histories/methods.js';

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makecolor() {
    var text = "";
    var possible = "abcdef0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
export const Createbot = new ValidatedMethod({
    name: 'Createbot',
    validate: new SimpleSchema({
        name: {
            type: String
        },
        ownerId: {
            type: String
        },
        category: {
            type: String
        },
        img: {
            type: String
        },
        description: {
            type: String
        }
    }).validator(),
    run(p) {
        try {


            var verifytoken = makeid();


            var botId = Bots.insert({
                name: p.name,
                ownerId: p.ownerId,
                category: p.category,
                img: p.img,
                description: p.description,
                verify_token: verifytoken + "_" + new Date().getTime()
            });
            var usersList = {
                color: makecolor(),
                id: p.ownerId,
                permission: "admin",
                nbrCnx: 0
            };
            Bots.update({ _id: botId }, { $push: { users: usersList } });

            insertHistory.call({
                action: "botcreation",
                botId: botId,
                userId: Meteor.userId()
            }, function(err) {
                if (err) {
                    console.log("insertHistoryfabric", err);
                }
            })

            return botId;

        } catch (error) {
            console.log(error);

            throw new Meteor.Error(010, error);
        }
    },
});

export const getBots = new ValidatedMethod({
    name: 'getBots',
    validate: new SimpleSchema({
        ownerId: {
            type: String
        },
        regex: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            if (p.regex !== "") {
                return Bots.find({
                    $or: [{
                        ownerId: p.ownerId,
                    }, {
                        "users.id": p.ownerId,
                    }],
                    blocked: false,
                    name: {
                        $regex: p.regex,
                        $options: 'i'
                    },
                });
            } else {
                return Bots.find({
                    $or: [{
                        ownerId: p.ownerId,
                    }, {
                        "users.id": p.ownerId,
                    }],
                    blocked: false,
                });
            }

        } catch (error) {
            console.log(error);

            throw new Meteor.Error(011, error);
        }
    },
});

export const getAllBots = new ValidatedMethod({
    name: 'getAllBots',
    validate: null,
    run(p) {
        try {
            return Bots.find({});

        } catch (error) {
            console.log(error);

            throw new Meteor.Error(011, error);
        }
    },
});

export const getBot = new ValidatedMethod({
    name: 'getBot',
    validate: new SimpleSchema({
        botId: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            console.log(Bots.findOne({
                _id: p.botId,
            }));
            return Bots.findOne({
                _id: p.botId,
            });

        } catch (error) {
            console.log(error);

            throw new Meteor.Error(012, error);
        }
    },
});

export const deleteBot = new ValidatedMethod({
    name: 'deleteBot',
    validate: new SimpleSchema({
        botId: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            console.log(Bots.findOne({
                _id: p.botId,
            }));
            return Bots.remove({
                _id: p.botId,
            });

        } catch (error) {
            console.log(error);

            throw new Meteor.Error(012, error);
        }
    },
});

export const updateBotContent = new ValidatedMethod({
    name: 'updateBotContent',
    validate: new SimpleSchema({
        botId: {
            type: String
        },
        content: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Bots.update({ _id: p.botId }, {
                $set: {
                    content: p.content
                }
            });

        } catch (error) {
            console.log(error);

            throw new Meteor.Error(013, error);
        }
    },
});
export const blockBot = new ValidatedMethod({
    name: 'blockBot',
    validate: new SimpleSchema({
        id: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Bots.update({ _id: p.id }, {
                $set: {
                    blocked: true
                }
            });

        } catch (error) {
            console.log(error);

            throw new Meteor.Error(013, error);
        }
    },
});
export const unBlockBot = new ValidatedMethod({
    name: 'unBlockBot',
    validate: new SimpleSchema({
        id: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Bots.update({ _id: p.id }, {
                $set: {
                    blocked: false
                }
            });

        } catch (error) {
            console.log(error);

            throw new Meteor.Error(013, error);
        }
    },
});
export const updateBotFbSettings = new ValidatedMethod({
    name: 'updateBotFbSettings',
    validate: new SimpleSchema({
        botId: {
            type: String
        },
        fbpageid: {
            type: String
        },
        fbpagetoken: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Bots.update({ _id: p.botId }, {
                $set: {
                    page_Id: p.fbpageid,
                    page_token: p.fbpagetoken
                }
            });

        } catch (error) {
            console.log(error);

            throw new Meteor.Error(013, error);
        }
    },
});

export const updateBot = new ValidatedMethod({
    name: 'updateBot',
    validate: new SimpleSchema({
        botId: {
            type: String
        },
        botname: {
            type: String
        },
        botcategory: {
            type: String
        },
        botdescription: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Bots.update({ _id: p.botId }, {
                $set: {
                    name: p.botname,
                    category: p.botcategory,
                    description: p.botdescription
                }
            });

        } catch (error) {
            console.log(error);

            throw new Meteor.Error(013, error);
        }
    },
});

export const updateBotUsers = new ValidatedMethod({
    name: 'updateBotUsers',
    validate: new SimpleSchema({
        botId: {
            type: String
        },
        index: {
            type: Number
        },
        plus: {
            type: Boolean
        }
    }).validator(),
    run(p) {
        try {
            var botUsers = getBot.call({ botId: p.botId }).users;
            console.log("p.index", p.index, botUsers[p.index]);
            if (p.plus) {
                botUsers[p.index].nbrCnx = Number(botUsers[p.index].nbrCnx) + 1;
            } else {
                botUsers[p.index].nbrCnx = Number(botUsers[p.index].nbrCnx) - 1;
            }


            return Bots.update({ _id: p.botId }, {
                $set: {
                    users: botUsers,
                }
            });

        } catch (error) {
            console.log(error);

            throw new Meteor.Error(013, error);
        }
    },
});

export const userInBot = new ValidatedMethod({
    name: 'userInBot',
    validate: new SimpleSchema({
        userId: {
            type: String
        },
        botId: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            var botUsers = getBot.call({ botId: p.botId }).users;
            if (botUsers) {
                for (var index = 0; index < botUsers.length; index++) {
                    var element = botUsers[index];
                    if (element.id == p.userId) {
                        return {
                            permission: element.permission
                        }
                    }
                }
                return false
            } else {
                return false
            }



        } catch (error) {
            console.log(error);

            throw new Meteor.Error(013, error);
        }
    },
});


export const addHim = new ValidatedMethod({
    name: 'addHim',
    validate: new SimpleSchema({
        userId: {
            type: String
        },
        botId: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            var usersList = {
                color: makecolor(),
                id: p.userId,
                permission: "collaborator",
                nbrCnx: 0
            };
            Bots.update({ _id: p.botId }, { $push: { users: usersList } });


        } catch (error) {
            console.log(error);

            throw new Meteor.Error(013, error);
        }
    },
});

export const changeUserPermission = new ValidatedMethod({
    name: 'changeUserPermission',
    validate: new SimpleSchema({
        botId: {
            type: String
        },
        userId: {
            type: String
        },
        permission: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            var botUsers = getBot.call({ botId: p.botId }).users;

            for (var index = 0; index < botUsers.length; index++) {
                var element = botUsers[index];

                if (element.id === p.userId) {
                    element.permission = p.permission
                }

            }


            return Bots.update({ _id: p.botId }, {
                $set: {
                    users: botUsers,
                }
            });

        } catch (error) {
            console.log(error);

            throw new Meteor.Error(013, error);
        }
    },
});