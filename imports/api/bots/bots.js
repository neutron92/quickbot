import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Bots = new Mongo.Collection('bots');

Schema = {};


Schema.Users = new SimpleSchema({
    color: {
        type: String,
        optional: true
    },
    id: {
        type: String,
        optional: true
    },
    permission: {
        type: String,
        optional: true,
        allowedValues: ['edit', 'readonly', 'collaborator', "admin"]
    },
    nbrCnx: {
        type: Number,
        optional: true,
    }
});

Schema.Bot = new SimpleSchema({
    name: {
        type: String
    },
    blocked: {
        type: Boolean,
        optional: true,
        defaultValue: false
    },
    ownerId: {
        type: String
    },
    category: {
        type: String,
        allowedValues: ['general', 'commerce', 'medical', 'sport', 'news', 'humor']
    },
    img: {
        type: String
    },
    verify_token: {
        type: String
    },
    page_Id: {
        type: String,
        optional: true
    },
    page_token: {
        type: String,
        optional: true
    },
    description: {
        type: String,
        optional: true
    },
    content: {
        type: String,
        optional: true
    },
    users: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "users.$": {
        type: Schema.Users,
        optional: true
    },
});


Bots.attachSchema(Schema.Bot);