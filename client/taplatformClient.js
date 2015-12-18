/**
 * Created by youyi on 2015/10/12.
 */

accountsUIBootstrap3.setLanguage('zh-CN');
i18n.setLanguage('zh');

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL',
    forceEmailLowercase: true,
    forceUsernameLowercase: true,
    forcePasswordLowercase: true,
    requestPermissions: {}
});

sAlert.config({effect: '', position: 'bottom', timeout: '1000', onRouteClose: true, stack: false, offset: '20px'});


Meteor.subscribe('findAllProjects');
Meteor.subscribe('findFeaturesInProject',window.location.pathname.split('/')[2]);
Meteor.subscribe('findCasesInProject',window.location.pathname.split('/')[2]);
Meteor.subscribe('findComments',window.location.pathname.split('/')[2]);
Meteor.subscribe('findImages');
Meteor.subscribe('findDefectsInProject',window.location.pathname.split('/')[2]);
Meteor.subscribe('findAllUsers');
