import {
    TAPi18n
} from 'meteor/tap:i18n';

getUserLanguage = function() {
    // Put here the logic for determining the user language

    return "en";
};

TAPi18n.setLanguage(getUserLanguage())
    .done(function() {
        // Session.set("showLoadingIndicator", false);
    })
    .fail(function(error_message) {
        // Handle the situation
        console.log(error_message);
    });