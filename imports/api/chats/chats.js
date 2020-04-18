import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Chats = new Mongo.Collection('chats');

Schema = {};

Schema.Chat = new SimpleSchema({
    text: {
        type: String,
        optional: true
    },
    botId: {
        type: String,
        optional: true
    },
    userId: {
        type: String,
        optional: true
    },
    dateAt: {
        type: Date,
        optional: true
    }

});


Chats.attachSchema(Schema.Chat);