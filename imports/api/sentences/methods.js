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

import { Sentences } from './sentences.js';

export const CreateSentence = new ValidatedMethod({
    name: 'CreateSentence',
    validate: new SimpleSchema({
        text: {
            type: String
        },
        intentId: {
            type: String
        },
        botId: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            console.log("psentece", p);
            return Sentences.insert({ text: p.text, intentId: p.intentId, botId: p.botId });
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(041, error);
        }
    },
});

export const removeSentence = new ValidatedMethod({
    name: 'removeSentence',
    validate: new SimpleSchema({
        id: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Sentences.remove({ _id: p.id });
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(042, error);
        }
    },
});

export const getSentences = new ValidatedMethod({
    name: 'getSentences',
    validate: new SimpleSchema({
        id: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Sentences.find({ intentId: p.id });
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(042, error);
        }
    },
});