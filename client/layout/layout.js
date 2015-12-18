/**
 * Created by youyi on 2015/10/14.
 */

Template.applicationLayout.events({
    "click #summary": function (e) {
        e.preventDefault();
        e.stopPropagation();
        Session.setPersistent("HEADER","");
        window.location="/";
    }
});

Template.applicationLayout.helpers({
    isHome: function () {
        return true;
    }
});