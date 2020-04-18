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

import { Histories } from './histories.js';


export const insertHistory = new ValidatedMethod({
    name: 'insertHistory',
    validate: new SimpleSchema({

        action: {
            type: String
        },
        botId: {
            type: String
        },
        userId: {
            type: String
        },
        componentId: {
            type: String,
            optional: true
        }
    }).validator(),
    run(p) {

        try {
            Histories.insert({
                botId: p.botId,
                action: p.action,
                userId: p.userId,
                componentId: p.componentId,
                dateAt: new Date()
            });
        } catch (error) {
            throw new Meteor.Error(203, error);
        }

    },
});

export const getAllHistories = new ValidatedMethod({
    name: 'getAllHistories',
    validate: new SimpleSchema({
        botId: {
            type: String
        }
    }).validator(),
    run(p) {

        try {
            return Histories.find({
                botId: p.botId,
            });

        } catch (error) {
            throw new Meteor.Error(203, error.reason);
        }

    },
});