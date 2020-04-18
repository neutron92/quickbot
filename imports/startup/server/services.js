import { Accounts } from 'meteor/accounts-base';
import { ServiceConfiguration } from 'meteor/service-configuration';


Accounts.config({
    forbidClientAccountCreation: true,
});

ServiceConfiguration.configurations.remove({
    service: "facebook"
});

ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: '249172525557308',
    secret: '84ec69c147ec0ecf3cbfda7713b21704'
});

ServiceConfiguration.configurations.remove({
    service: "twitter"
});

ServiceConfiguration.configurations.insert({
    service: "twitter",
    consumerKey: 'A6n2dnUhMHDRlgPdu7nW9YgZp',
    secret: '9krCfoEBv5Z49FNw9kmxy0gh6ff7n7ghklIfljgKRdM9WCRXlA'
});

/*ServiceConfiguration.configurations.remove({
    service: "google"
});

ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: '680751265984-pqvlbhmoq0oe31ki5pl962ef0g14pn4b.apps.googleusercontent.com',
    secret: 'fu1Tm46GyzXYLZIARfAEYNV_'
});*/

Accounts.onCreateUser(function(options, user) {
    if (user.services.facebook) {
        console.log("facebook", user, options);
        user.profile = { fullname: user.services.facebook.name };
        user.username = user.services.facebook.first_name.toLowerCase() + user.services.facebook.last_name.toLowerCase();
        user.emails = [{ address: user.services.facebook.email, verified: true }];
    } else if (user.services.twitter) {
        console.log("twitter", user, options);
        user.profile = { fullname: options.profile.name };
        user.username = user.services.twitter.screenName;
        // user.emails = [{ address: user.services.twitter.email, verified: true }];
    } else {
        return user;
    }




    return user;
});