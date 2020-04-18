import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Answers } from '../answers.js';
Meteor.publish('answers', function(id) {
    return Answers.find();
});