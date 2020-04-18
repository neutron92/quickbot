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

import { Chats } from './chats.js';


export const insertChat = new ValidatedMethod({
    name: 'insertChat',
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
            Chats.insert({
                botId: p.botId,
                text: p.text,
                userId: p.userId,
                dateAt: new Date()
            });
        } catch (error) {
            throw new Meteor.Error(203, error);
        }

    },
});

export const getAllChat = new ValidatedMethod({
    name: 'getAllChat',
    validate: new SimpleSchema({
        botId: {
            type: String
        }
    }).validator(),
    run(p) {

        try {
            return Chats.find({
                botId: p.botId,
            });

        } catch (error) {
            throw new Meteor.Error(203, error.reason);
        }

    },
});