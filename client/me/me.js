/**
 * Created by youyi on 2015/11/17.
 */
Template.me.events({
    'click #myspace': function (e) {
        e.preventDefault();
        if(Meteor.userId()){
            window.location="/me";
        }else{
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
    }
});

Template.me.helpers({
    username: function () {
        return Meteor.user().username;
    },
    header: function () {
        var arr=location.pathname.split('/');
        var kw=arr[arr.length-1];
        kw=kw!=''?kw:arr[arr.length-2];
        if(kw=='defectassigned'){
            return "缺陷总数："+Session.get('DEFECTSASSIGNED').length;
        }else if(kw=='defectcreated'){
            return "缺陷总数："+Session.get('DEFECTSCREATED').length;
        }else if(kw=='me'){
            var text=Session.get('DEFECTSCREATED').length==0 ? '' : '您已上报了'+Session.get('DEFECTSCREATED').length+'个bug。';
            text+=Session.get('DEFECTSASSIGNED').length==0 ? '' : '您还有'+Session.get('DEFECTSASSIGNED').length+'个bug待处理。';
            return text;
        }
    }
});

Template.defectAssigned.helpers({
    defectsAssigned: function(){
        return Session.get('DEFECTSASSIGNED');
    },
    settings: function () {
        return {
            rowsPerPage: 30,
            showFilter: true,
            fields: [
                {
                    key: 'topic',label: '标题',cellClass: 'col-md-2 topic',sortByValue:true,
                    fn: function (topic, object) {
                        var html = '<a class="defectInfo" href="' + location.pathname.split('/')[0] + '/project/' + object.pid + '/defect/' + object._id + '">' + topic + '</a>';
                        return new Spacebars.SafeString(html);
                    }
                },
                {   key: 'feature.text', label: '所属需求',cellClass: 'col-md-2' },
                {   key: 'status', label: '状态',cellClass: 'col-md-1 status',sortByValue:true,
                    fn: function (status, object) {
                        var html = '<a class="processDefect" href="' + location.pathname.split('/')[0] + '/project/' + object.pid + '/defect/' + object._id + '/process">' + status + '</a>';
                        return new Spacebars.SafeString(html);
                    }
                },
                {   key: 'priority', label: '优先级',cellClass: 'col-md-1'},
                {   key: 'severity', label: '严重程度',cellClass: 'col-md-1'},
                {   key: 'creator', label: '报告者',cellClass: 'col-md-1' },
                {   key: 'assignTo.text', label: '处理者',cellClass: 'col-md-1' },
                {   key: 'createdAt', label: '创建时间',cellClass: 'col-md-1' },
                {   key: 'updatedAt', label: '更新时间',cellClass: 'col-md-1' },
                {   label: '删除',cellClass: 'col-md-1',
                    fn: function (object) {
                        var html = '<span class="glyphicon glyphicon-remove"></span>';
                        return new Spacebars.SafeString(html);
                    }
                }
            ],
            filters:['topic','feature.text']
        };
    }
});

Template.defectAssigned.events({
    'click .topic': function (e) {
        if(e.target.pathname){
            e.preventDefault();
            e.stopPropagation();
            window.location= e.target.pathname;
        }
    },
    'click .status': function (e) {
        if(e.target.pathname){
            e.preventDefault();
            e.stopPropagation();
            window.location= e.target.pathname;
        }
    }
});

Template.defectCreated.events({
    'click .topic': function (e) {
        if(e.target.pathname){
            e.preventDefault();
            e.stopPropagation();
            window.location= e.target.pathname;
        }
    },
    'click .status': function (e) {
        if(e.target.pathname){
            e.preventDefault();
            e.stopPropagation();
            window.location= e.target.pathname;
        }
    }
});

Template.defectCreated.helpers({
    defectsCreated: function(){
        return Session.get('DEFECTSCREATED');
    },
    settings: function () {
        return {
            rowsPerPage: 30,
            showFilter: true,
            fields: [
                {
                    key: 'topic',label: '标题',cellClass: 'col-md-2 topic',sortByValue:true,
                    fn: function (topic, object) {
                        var html = '<a class="defectInfo" href="' + location.pathname.split('/')[0] + '/project/' + object.pid + '/defect/' + object._id + '">' + topic + '</a>';
                        return new Spacebars.SafeString(html);
                    }
                },
                {   key: 'feature.text', label: '所属需求',cellClass: 'col-md-2' },
                {   key: 'status', label: '状态',cellClass: 'col-md-1 status',sortByValue:true,
                    fn: function (status, object) {
                        var html = '<a class="processDefect" href="' + location.pathname.split('/')[0] + '/project/' + object.pid + '/defect/' + object._id + '/process">' + status + '</a>';
                        return new Spacebars.SafeString(html);
                    }
                },
                {   key: 'priority', label: '优先级',cellClass: 'col-md-1'},
                {   key: 'severity', label: '严重程度',cellClass: 'col-md-1'},
                {   key: 'creator', label: '报告者',cellClass: 'col-md-1' },
                {   key: 'assignTo.text', label: '处理者',cellClass: 'col-md-1' },
                {   key: 'createdAt', label: '创建时间',cellClass: 'col-md-1' },
                {   key: 'updatedAt', label: '更新时间',cellClass: 'col-md-1' },
                {   label: '删除',cellClass: 'col-md-1',
                    fn: function (object) {
                        var html = '<span class="glyphicon glyphicon-remove"></span>';
                        return new Spacebars.SafeString(html);
                    }
                },
                { key: 'createdAt', label: 'createdAt', hidden: true, sortOrder: 0, sortDirection: 'descending' }
            ],
            filters:['topic','feature.text']
        };
    }
});

Meteor.call("findDefectsAssignToMe",function(err,data){
    if(err){
        Session.setPersistent('DEFECTSASSIGNED',[]);
    }else{
        Session.setPersistent('DEFECTSASSIGNED',data);
    }
});

Meteor.call("findDefectsCreatedByMe",function(err,data){
    if(err){
        Session.setPersistent('DEFECTSCREATED',[]);
    }else{
//        var arr=[];
//        _.each(data,function(element){
//            arr.push({name:element._id+'<br>数量：'+element.count,y:element.count,color:'#'+ Math.floor(Math.random()*16777215).toString(16)})
//        });
        Session.setPersistent('DEFECTSCREATED',data);
    }
});