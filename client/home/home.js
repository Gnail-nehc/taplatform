/**
 * Created by youyi on 2015/10/14.
 */
Template.home.helpers({
    projects: function(){
        return Project.find({}).fetch();
    }
});

Template.home.events({
    "click .addProjectBtn": function (e) {
        e.preventDefault();
        if(!Meteor.userId()){
            e.stopPropagation();
            sAlert.error('请先登录！');
        }
    },
    "click .myCategory": function (e) {
        e.preventDefault();
        if(!Meteor.userId()){
            e.stopPropagation();
            sAlert.error('请先登录！');
        }else{
            window.location= e.target.pathname;
        }
    },
    'click .sumCategory': function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.location= e.target.pathname;
    },
    "click .addPrj": function (e) {
        e.preventDefault();
        var name=$('#prjname').val();
        var desc=$('#prjdesc').val();
        if(name.replace(/(^s*)|(s*$)/g, "").length!=0 && desc.replace(/(^s*)|(s*$)/g, "").length!=0){
            Meteor.call("addProject", name, desc,function(err,result){
                if(err){
                    sAlert.error(err.error);
                }else{
                    $('#addProjectModal').modal('toggle');
                }
            })
        }else{
            e.stopPropagation();
            sAlert.error('名称、描述不能为空！');
        }
    },
    "click .viewInfo": function(e) {
        e.preventDefault();
        e.stopPropagation();
        var name=e.target.parentNode.parentNode.childNodes[1].childNodes[0].nodeValue;
        var path=e.target.pathname;
//        Session.setPersistent("PRJNAME",name);
//        Session.setPersistent("PRJPATH",path);
//        Session.setPersistent("PID",path.split('/')[path.split('/').length-1]);
        Session.setPersistent("HEADER","概况");
        window.location=path;
    },
    'click #myspace': function (e) {
        e.preventDefault();
        if(Meteor.userId()){
            window.location="/me";
        }else{
            e.stopPropagation();
            sAlert.error('请先登录！');
        }
    }
});

