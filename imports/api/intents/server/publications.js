import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Intents } from '../intents.js';

Meteor.publish('intents', function(id) {
    return Intents.find({});
});