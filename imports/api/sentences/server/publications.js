import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Sentences } from '../sentences.js';

Meteor.publish('sentences', function(id) {
    return Sentences.find({});
});