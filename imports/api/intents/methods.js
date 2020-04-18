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

import { Intents } from './intents.js';
import { Answers } from '../answers/answers.js';


export const CreateIntent = new ValidatedMethod({
    name: 'CreateIntent',
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
            return Intents.insert({ name: p.name, botId: p.botId, svgId: p.svgId });
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(021, error);
        }
    },
});
export const CreateIntentAddSVG = new ValidatedMethod({
    name: 'CreateIntentAddSVG',
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
            return Intents.insert({ botId: p.botId, svgId: p.svgId });
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(025, error);
        }
    },
});


export const getIntent = new ValidatedMethod({
    name: 'getIntent',
    validate: new SimpleSchema({
        id: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            return Intents.findOne({ _id: p.id });
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(022, error);
        }
    },
});

export const addIntentLink = new ValidatedMethod({
    name: 'addIntentLink',
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
            console.log("pintent", p);
            answer = Answers.findOne({ _id: p.id2 });

            intent = Intents.findOne({ _id: p.id });
            console.log("intent", answer, intent);
            if (answer && answer._id) {
                if (intent && intent._id) {
                    a = Answers.update({ _id: answer._id }, { $set: { lastIntentId: intent._id } });
                    i = Intents.update({ _id: intent._id }, { $set: { nextAnswerId: answer._id } });
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

export const editIntentName = new ValidatedMethod({
    name: 'editIntentName',
    validate: new SimpleSchema({
        id: {
            type: String
        },
        name: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            Intents.update({ _id: p.id }, { $set: { name: p.name } });
            return Intents.findOne({ _id: p.id });
        } catch (error) {
            console.log(error);

            throw new Meteor.Error(024, error);
        }
    },
});

export const getComponentName = new ValidatedMethod({
    name: 'getComponentName',
    validate: new SimpleSchema({
        id: {
            type: String
        }
    }).validator(),
    run(p) {
        try {
            var intent = Intents.findOne({ _id: p.id });
            var intentName;
            if (intent) {
                if (intent.name) {
                    intentName = intent.name;
                } else {
                    intentName = intent.svgId
                }
            }
            var answer = Answers.findOne({ _id: p.id });
            var answerName;
            if (answer) {
                if (answer.name) {
                    answerName = answer.name;
                } else {
                    answerName = answer.svgId
                }
            }
            if (intentName) {
                return intentName;
            }

            if (answerName) {
                return answerName;
            }

        } catch (error) {
            console.log(error);

            throw new Meteor.Error(022, error);
        }
    },
});