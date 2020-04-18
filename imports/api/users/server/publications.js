import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import '../users';
Meteor.publish('users', function(id) {
    return Meteor.users.find({});
});