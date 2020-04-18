import {
    Meteor
} from 'meteor/meteor';
import {
    ValidatedMethod
} from 'meteor/mdg:validated-method';
import {
    Accounts
} from 'meteor/accounts-base';

import {
    moment
} from 'meteor/momentjs:moment';
import SimpleSchema from 'simpl-schema';

import './users.js'

export const CreateUser = new ValidatedMethod({
    name: 'CreateUser',
    validate: new SimpleSchema({
        email: {
            type: String
        },
        password: {
            type: String
        },
        fullname: {
            type: String
        }
    }).validator(),
    run(p) {
        try {

            if (Meteor.isServer) {
                var user = Accounts.createUser({
                    email: p.email,
                    password: p.password,
                    profile: {
                        fullname: p.fullname
                    }
                });
                console.log("user", user);
                //  Roles.addUsersToRoles(user, 'manager', "quickbot");
                Meteor.users.update({ _id: user }, {
                    $set: {
                        "profile.fullname": p.fullname
                    },
                    $push: { roles: "manager" }
                });
            }

            return "done"
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(001, error);
        }
    },
});

export const addNewAdmin = new ValidatedMethod({
    name: 'addNewAdmin',
    validate: new SimpleSchema({
        email: {
            type: String
        },
        password: {
            type: String
        },
        fullname: {
            type: String
        }
    }).validator(),
    run(p) {
        try {

            if (Meteor.isServer) {
                var user = Accounts.createUser({
                    email: p.email,
                    password: p.password,
                    profile: {
                        fullname: p.fullname
                    }
                });
                console.log("user", user);
                //  Roles.addUsersToRoles(user, 'manager', "quickbot");
                Meteor.users.update({ _id: user }, {
                    $set: {
                        "profile.fullname": p.fullname
                    },
                    $push: { roles: "admin" }
                });
            }

            return "done"
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(001, error);
        }
    },
});

export const updateFullName = new ValidatedMethod({
    name: 'updateFullName',
    validate: new SimpleSchema({
        id: {
            type: String
        },
        fullname: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Meteor.users.update({ _id: id }, {
                $set: {
                    "profile.fullname": p.fullname
                }
            })
        } catch (error) {
            console.log(error);
            //throw new Meteor.Error(002, error);
        }
    },
});

export const updateRole = new ValidatedMethod({
    name: 'updateRole',
    validate: new SimpleSchema({
        id: {
            type: String
        },
        role: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            //  Roles.addUsersToRoles(p.id, [p.role], "quickbot");
            Meteor.users.update({ _id: p.id }, {
                $push: { roles: p.role }
            });
        } catch (error) {
            console.log(error);
            //throw new Meteor.Error(002, error);
        }
    },
});

export const getUser = new ValidatedMethod({
    name: 'getUser',
    validate: new SimpleSchema({
        id: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Meteor.users.findOne({ _id: p.id }, { fields: { 'profile': 1 } })
        } catch (error) {
            console.log(error);
            //throw new Meteor.Error(002, error);
        }
    },
});
export const getAllusers = new ValidatedMethod({
    name: 'getAllusers',
    validate: null,
    run(p) {
        try {
            return Meteor.users.find({}, { fields: { 'profile': 1, 'services': 1, 'roles': 1, 'emails': 1, 'username': 1 } })
        } catch (error) {
            console.log(error);
            //throw new Meteor.Error(002, error);
        }
    },
});


export const getUsersForInvitation = new ValidatedMethod({
    name: 'getUsersForInvitation',
    validate: new SimpleSchema({
        emailOrName: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            var users = Meteor.users.find({
                $or: [{
                    "profile.fullname": {
                        $regex: p.emailOrName,
                        $options: 'i'
                    }
                }, {
                    "emails.address": {
                        $regex: p.emailOrName,
                        $options: 'i'
                    }
                }]

            }, { fields: { 'profile': 1 } }).fetch();
            if (!users) {
                var re = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';
                if (re.test(p.emailOrName)) {
                    users = {
                        email: p.emailOrName
                    }
                } else {
                    users = "notemail"
                }

            }
            return users;
        } catch (error) {
            console.log(error);
            //throw new Meteor.Error(002, error);
        }
    },
});

export const deleteUser = new ValidatedMethod({
    name: 'deleteUser',
    validate: new SimpleSchema({
        id: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Meteor.users.remove({ _id: p.id })
        } catch (error) {
            console.log(error);
            //throw new Meteor.Error(002, error);
        }
    },
});