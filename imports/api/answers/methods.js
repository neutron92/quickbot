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

import { Answers } from './answers.js';
import { Intents } from '../intents/intents.js';

export const CreateAnswer = new ValidatedMethod({
    name: 'CreateAnswer',
    validate: new SimpleSchema({
        name: {
            type: String
        },
        botId: {
            type: String
        },
        svgId: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Answers.insert({ text: p.name, botId: p.botId, svgId: p.svgId });
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(031, error);
        }
    },
});

export const CreateAnswerAddSVG = new ValidatedMethod({
    name: 'CreateAnswerAddSVG',
    validate: new SimpleSchema({
        botId: {
            type: String
        },
        svgId: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Answers.insert({ botId: p.botId, svgId: p.svgId });
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(025, error);
        }
    },
});

export const getAnswer = new ValidatedMethod({
    name: 'getAnswer',
    validate: new SimpleSchema({
        id: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Answers.findOne({ _id: p.id });
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(032, error);
        }
    },
});

export const addAnswerLink = new ValidatedMethod({
    name: 'addAnswerLink',
    validate: new SimpleSchema({
        id: {
            type: String,
            optional: true
        },
        id2: {
            type: String,
            optional: true
        }
    }).validator(),
    run(p) {
        try {
            var answer, intent, a, i;
            console.log("panswer", p);
            answer = Answers.findOne({ _id: p.id });

            intent = Intents.findOne({ _id: p.id2 });
            console.log("answer", answer._id, intent._id);
            if (answer && answer._id) {
                if (intent && intent._id) {
                    a = Answers.update({ _id: answer._id }, { $set: { nextIntentId: intent._id } });
                    i = Intents.update({ _id: intent._id }, { $set: { lastAnswerId: answer._id } });
                }
            }
            console.log(a, i);
            return { a, i };
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(033, error);
        }
    },
});

export const editanswerName = new ValidatedMethod({
    name: 'editanswerName',
    validate: new SimpleSchema({
        id: {
            type: String
        },
        name: {
            type: String
        },
        text: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            Answers.update({ _id: p.id }, { $set: { name: p.name, text: p.text } });
            return Answers.findOne({ _id: p.id });
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(034, error);
        }
    },
});