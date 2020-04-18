import {
    Meteor
} from 'meteor/meteor';

import {
    ValidatedMethod
} from 'meteor/mdg:validated-method';
import {
    TAPi18n
} from 'meteor/tap:i18n';

import {
    moment
} from 'meteor/momentjs:moment';
import SimpleSchema from 'simpl-schema';

import { Messages } from './messages.js';

import { Answers } from '../answers/answers.js';
import { Sentences } from '../sentences/sentences.js';
import { Intents } from '../intents/intents.js';

export const insertMessage = new ValidatedMethod({
    name: 'insertMessage',
    validate: new SimpleSchema({

        text: {
            type: String
        },
        botId: {
            type: String
        },
        userId: {
            type: String
        }
    }).validator(),
    run(p) {

        try {
            console.log("pinsertMessage", p);
            var intent, answer
            var sentence = Sentences.findOne({ botId: p.botId, text: p.text })

            Messages.insert({
                botId: p.botId,
                text: p.text,
                user: true,
                userId: p.userId,
                sentAt: new Date()
            });
            if (sentence && sentence._id) {
                intent = Intents.findOne({ _id: sentence.intentId })
                answer = Answers.findOne({ _id: intent.nextAnswerId })
                Messages.insert({
                    botId: p.botId,
                    text: answer.text,
                    user: false,
                    sentAt: new Date()
                });
                return { intent: intent, sentence: sentence, answer: answer }
            } else {
                Messages.insert({
                    botId: p.botId,
                    text: TAPi18n.__("verifybot"),
                    user: false,
                    error: true,
                    sentAt: new Date()
                });
                return ""
            }


        } catch (error) {
            throw new Meteor.Error(203, error);
        }

    },
});

export const getMessages = new ValidatedMethod({
    name: 'getMessages',
    validate: new SimpleSchema({
        botId: {
            type: String
        },
    }).validator(),
    run(p) {

        try {
            return Messages.find({
                botId: p.botId,
            });

        } catch (error) {
            throw new Meteor.Error(203, error.reason);
        }

    },
});

export const deleteAllMessages = new ValidatedMethod({
    name: 'deleteAllMessages',
    validate: new SimpleSchema({
        botId: {
            type: String
        },
    }).validator(),
    run(p) {

        try {
            return Messages.remove({
                botId: p.botId,
            });

        } catch (error) {
            throw new Meteor.Error(203, error.reason);
        }

    },
});