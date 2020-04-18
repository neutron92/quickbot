import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Bots } from '../bots.js';
Meteor.publish('bots', function(id) {
    return Bots.find();
});