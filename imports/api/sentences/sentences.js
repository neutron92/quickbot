import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Sentences = new Mongo.Collection('sentences');

Schema = {};


Schema.Sentence = new SimpleSchema({
    text: {
        type: String
    },
    intentId: {
        type: String
    },
    botId: {
        type: String
    }
});


Sentences.attachSchema(Schema.Sentence);