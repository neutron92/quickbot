import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Chats } from '../chats.js';

Meteor.publish('chats', function() {
    return Chats.find({});
});