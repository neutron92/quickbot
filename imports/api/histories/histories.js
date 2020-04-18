import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Histories = new Mongo.Collection('histories');

Schema = {};

Schema.History = new SimpleSchema({
    action: {
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
    componentId: {
        type: String,
        optional: true
    },
    dateAt: {
        type: Date,
        optional: true
    }

});


Histories.attachSchema(Schema.History);