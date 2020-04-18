import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Histories } from '../histories.js';

Meteor.publish('histories', function(id) {
    return Histories.find({});
});