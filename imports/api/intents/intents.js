import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Intents = new Mongo.Collection('intents');

Schema = {};

Schema.Intent = new SimpleSchema({
    name: {
        type: String,
        optional: true
    },
    botId: {
        type: String,
        optional: true
    },
    lastAnswerId: {
        type: String,
        optional: true
    },
    nextAnswerId: {
        type: String,
        optional: true
    },
    svgId: {
        type: String,
        optional: true
    },
    type: {
        type: String,
        optional: true
    }
});


Intents.attachSchema(Schema.Intent);