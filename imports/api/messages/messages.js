import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Messages = new Mongo.Collection('messages');



Schema = {};

Schema.Message = new SimpleSchema({
    user: {
        type: Boolean,
        optional: true
    },
    error: {
        type: Boolean,
        optional: true
    },
    botId: {
        type: String,
        optional: true
    },
    text: {
        type: String,
        optional: true
    },
    userId: {
        type: String,
        optional: true
    },
    sentAt: { type: Date },
});


Messages.attachSchema(Schema.Message);