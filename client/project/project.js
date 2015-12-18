/**
 * Created by youyi on 2015/10/14.
 */
Template.project.helpers({
    projectName: function(){
        var path=window.location.pathname;
        var arr=path.split('/');
        var id= arr[2];
        return Project.findOne({_id:id}).name;
    },
    projectPath: function(){
        var path=window.location.pathname;
        var arr=path.split('/');
        return arr[0]+'/'+arr[1]+'/'+arr[2];
    },
    header: function(){
        var arr=location.pathname.split('/');
        var kw=arr.length>3 ? arr[3] : arr[1];
        if(kw=='project'){
            return "测试项目概况";
        }else if(kw=='feature'){
            return "测试需求详情";
        }else if(kw=='case'){
            var percent='';
            var total=Case.find({}).count();
            if(total==0){
                percent='未开始';
            }else{
                var tested=Case.find({testResult:{ $ne : '待测试' }}).count();
                percent=parseInt(tested/total*100)+'%     '+tested+" of "+total;
            }
            return "测试用例详情，测试进度："+percent;
        }else if(kw=='defect'){
            return "缺陷详情";
        }else{
            return Session.get("HEADER");
        }
    }
});

Template.project.events({
    "click .category": function(e) {
        e.preventDefault();
        e.stopPropagation();
        Session.setPersistent("HEADER",e.target.childNodes[0].nodeValue);
        window.location= e.target.pathname;
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
    'click .title':function(){
        var arr=location.pathname.split('/');
        window.location='/'+arr[1]+'/'+arr[2];
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

