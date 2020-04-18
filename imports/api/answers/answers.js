import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Answers = new Mongo.Collection('answers');

Schema = {};

Schema.answer = new SimpleSchema({
    title: {
        type: String,
        optional: true
    },
    subtitle: {
        type: String,
        optional: true
    },
    image_url: {
        type: String,
        optional: true
    },
    default_url: {
        type: String,
        optional: true
    },
    web_url: {
        type: String,
        optional: true
    },
    web_url_name: {
        type: String,
        optional: true
    },
    postback: {
        type: String,
        optional: true
    },
    postback_name: {
        type: String,
        optional: true
    }
});

Schema.Answer = new SimpleSchema({
    text: {
        type: String,
        optional: true
    },
    answer: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "answer.$": {
        type: Schema.answer,
        optional: true
    },
    name: {
        type: String,
        optional: true
    },
    botId: {
        type: String,
        optional: true
    },
    lastIntentId: {
        type: String,
        optional: true
    },
    nextIntentId: {
        type: String,
        optional: true
    },
    svgId: {
        type: String,
        optional: true
    },
    type: {
        type: String,
        allowedValues: ['simple', 'generic'],
        defaultValue: 'simple',
        optional: true

    }

});


Answers.attachSchema(Schema.Answer);