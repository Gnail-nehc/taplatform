/**
 * Created by youyi on 2015/10/20.
 */


Template.defectList.helpers({
    settings: function () {
        return {
            collection: Defect,
            rowsPerPage: 30,
            showFilter: true,
            fields: [
                {
                    key: 'topic',label: '标题',cellClass: 'col-md-2',sortByValue:true,
                    fn: function (topic, object) {
                        var html = '<a class="defectInfo" href="' + location.pathname + '/' + object._id + '">' + topic + '</a>';
                        return new Spacebars.SafeString(html);
                    }
                },
                {   key: 'feature.text', label: '所属需求',cellClass: 'col-md-2' },
                {   key: 'status', label: '状态',cellClass: 'col-md-1',sortByValue:true,
                    fn: function (status, object) {
                        var html = '<a class="processDefect" href="' + location.pathname + '/' + object._id + '/process">' + status + '</a>';
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
//                { key: 'createdAt', label: 'createdAt', hidden: true, sortOrder: 0, sortDirection: 'descending' }
            ],
            filters:['feature.text','priority','topic','status']
        };
    },
    features: function () {
        return Feature.find({}).fetch();
    },
    allUsers: function(){
       return  Meteor.users.find().fetch();
    }
});

Template.defectList.events({
    'click .addDefectBtn': function (e) {
        e.preventDefault();
        if(!Meteor.userId()){
            e.stopPropagation();
            sAlert.error('请先登录！');
        }
    },
    'click .defectInfo': function (e) {
        e.preventDefault();
        var creator=e.target.parentNode.parentNode.children[5].textContent;
        if(Meteor.user() && Meteor.user().username==creator){
            var path=e.target.pathname;
            var index=e.target.className=='defectInfo' ? 1 : 2;
//        Session.setPersistent('BUGID',path.split('/')[path.split('/').length-index]);
//        Session.setPersistent('BUG',Defect.findOne(Session.get('BUGID')));
            window.location= path;
        }else{
            e.stopPropagation();
            sAlert.error('只能由报告者修改缺陷描述！');
        }
    },
    'click .addDefectButton': function (e) {
        e.preventDefault();
        var topic=$('#topic').val();
        var feature=$("#bugrelatedfeature option:selected");
        var featureValue=feature.val();
        var featureText=feature.text();
        var steps=$('#bugsteps').val();
        var expectedrespond=$('#bugexpectedrespond').val();
        var actualrespond=$('#actualrespond').val();
        if(topic.replace(/(^s*)|(s*$)/g, "").length!=0 && featureText.replace(/(^s*)|(s*$)/g, "").length!=0 && steps.replace(/(^s*)|(s*$)/g, "").length!=0 && expectedrespond.replace(/(^s*)|(s*$)/g, "").length!=0 && actualrespond.replace(/(^s*)|(s*$)/g, "").length!=0 ){
            var precondition=$('#bugprecondition').val();
            var severity=$("#severity option:selected").text();
            var priority=$("#priority option:selected").text();
            var assignto=$("#assignto option:selected");
            var to=assignto.text();
            var userid=assignto.val();
            var attachment=Session.get('IMAGEID');
            var arr=location.pathname.split('/');
            Meteor.call("addDefect",arr[2],{'text':featureText,'value':featureValue},topic,precondition,steps,expectedrespond,actualrespond,severity,priority,attachment,{'text':to,'value':userid},
                function(err,result){
                    if(err){
                        sAlert.error(err.error);
                    }else{
                        var did=Defect.findOne({topic:topic,pid:arr[2],assignTo:{'text':to,'value':userid}})._id;
                        var operation='【状态】：新建。 由 '+Meteor.user().username+' 分配给 '+to;
                        //log operation
                        Meteor.call('addComment',arr[2],did ,operation, 'bug',function(err,result){
                            if(err){
                                sAlert.error(err.error);
                            }
                        });
                        //$('#addDefectModal').modal('toggle');
                        //send email
                        var toEmail=Meteor.users.find({_id:userid}).fetch()[0].emails[0].address;
                        var body='【bug详情】：'+window.location.origin+location.pathname+'/'+did+'/process  '+operation;
                        Meteor.call("sendEmail",Meteor.user().emails[0].address,toEmail,'','【您有1条bug需要处理】'+topic,body,
                            function(err,result){
                                if(err){
                                    sAlert.error(err.error);
                                }
                            }
                        );
                        window.location=location.pathname;
                    }
            })
        }else{
            e.stopPropagation();
            sAlert.error('主题、所属需求、重现步骤、期望结果、实际结果不能为空！');
        }
    },
    'click .processDefect': function(e) {
        e.preventDefault();
        e.stopPropagation();
        var path=e.target.pathname;
        var index=e.target.className=='defectInfo' ? 1 : 2;
//        Session.setPersistent('BUGID',path.split('/')[path.split('/').length-index]);
//        Session.setPersistent('BUG',Defect.findOne(Session.get('BUGID')));
        window.location= path;
    },
    'click .reactive-table tbody tr': function (e) {
        e.preventDefault();
        var href=e.target.parentNode.parentNode.firstElementChild.childNodes[0].href;
        Session.set('TempRemovingDefect',href.split('/')[href.split('/').length-1]);
        if (e.target.className == "glyphicon glyphicon-remove") {
            if(Meteor.userId() && Meteor.user().username=='admin') {
                new Confirmation({
                    message: "确定要删除?",
                    title: "确认删除",
                    cancelText: "否",
                    okText: "是",
                    success: true
                }, function (ok) {
                    if(ok){
                        var imageid=Defect.findOne(Session.get('TempRemovingDefect')).attachment;
                        Meteor.call("removeDefect", Session.get('TempRemovingDefect'), function (err, result) {
                            if (err) {
                                sAlert.error(err.error);
                            }else{
                                //delete attachment
                                if(imageid){
                                    Image.remove({_id:imageid},function(err){
                                        if(err){
                                            sAlert.error(err.error);
                                        }
                                    });
                                }
                                //delete comment
                                Meteor.call("removeCommentByReferenceId",location.pathname.split('/')[2],Session.get('TempRemovingDefect'),function(err,result){
                                    if(err){
                                        sAlert.error(err.error);
                                    }
                                });
                            }
                        });
                    }
                });
            }else{
                e.stopPropagation();
                sAlert.error('只能admin删除！');
            }
        }
    }
});

Template.defectEdit.helpers({
    selectedDefect: function () {
        var id=window.location.pathname.split('/')[4];
        return Defect.findOne({_id:id});
    },
    features: function () {
        return Feature.find({}).fetch();
    },
    allUsers: function(){
        return  Meteor.users.find().fetch();
    }
});

Template.defectEdit.events({
    'click .updateDefectButton': function(e) {
        e.preventDefault();
        if(Meteor.userId()){
            var topic=$('#edittopic').val();
            var steps=$('#editsteps').val();
            var expected=$('#editexpectedrespond').val();
            var actual=$('#editactualrespond').val();
            if (topic.replace(/(^s*)|(s*$)/g, "").length!=0 && steps.replace(/(^s*)|(s*$)/g, "").length!=0 && expected.replace(/(^s*)|(s*$)/g, "").length!=0
                 && actual.replace(/(^s*)|(s*$)/g, "").length!=0) {
                var feature=$("#editrelatedfeature option:selected");
                var precondition=$('#editprecondition').val();
                var severity=$("#editseverity option:selected").text();
                var priority=$("#editpriority option:selected").text();
                var assignto=$("#editassignto option:selected");
                var to=assignto.text();
                var userid=assignto.val();
                var fValue=feature.val();
                var fText=feature.text();
                var did=window.location.pathname.split('/')[4];
                var bug=Defect.findOne({_id:did});
                var attachment=Session.get('IMAGEID') ? Session.get('IMAGEID') : bug.attachment;
                Meteor.call("updateDefect",did, {'text':fText,'value':fValue},topic,precondition,steps,expected,actual,severity,priority,attachment,{'text':to,'value':userid},
                    function(err,result){
                        if(err){
                            sAlert.error(err.error);
                        }else{
                            var arr=window.location.pathname.split('/');
                            var oldAssignTo=bug.assignTo.text;
                            if(to!=oldAssignTo){
                                var operation='【状态】：新建。 由 '+Meteor.user().username+' 分配给 '+to;
                                //log operation
                                var pid=arr[2];
                                Meteor.call('addComment',pid,did ,operation, 'bug',function(err,result){
                                    if(err){
                                        sAlert.error(err.error);
                                    }
                                });
                                //$('#addDefectModal').modal('toggle');
                                //send email
                                var creatorEmail=Meteor.users.find({username:bug.creator}).fetch()[0].emails[0].address;
                                var toEmail=Meteor.users.find({_id:userid}).fetch()[0].emails[0].address;
                                var oldAssignEmail=Meteor.users.find({_id:bug.assignTo.value}).fetch()[0].emails[0].address;
                                var body='【bug详情】：'+window.location.origin+location.pathname+'/process  '+operation;
                                Meteor.call("sendEmail",[creatorEmail,oldAssignEmail],toEmail,'','【您有1条新建bug变更了处理人】'+topic,body,
                                    function(err,result){
                                        if(err){
                                            sAlert.error(err.error);
                                        }
                                    }
                                );
                            }
                            window.location='/'+arr[1]+'/'+arr[2]+'/'+arr[3];
                        }
                })
            }else{
                e.stopPropagation();
                sAlert.error('所属需求、主题、重现步骤、期望结果、实际结果 不能为空！');
            }
        }else{
            e.stopPropagation();
            sAlert.error('请先登录！');
        }
    }
});

Template.defectProcess.rendered = function() {
    if(!this._rendered) {
        if($("#selectstatus option:selected").text().indexOf('关闭')>0){
            $('#processassignto')[0].disabled=true;
        }else{
            $('#processassignto')[0].disabled=false;
        }
        this._rendered = true;
    }
};

Template.defectProcess.helpers({
    selectedDefect: function () {
        var arr=window.location.pathname.split('/');
        var did=arr[arr.length-2];
        return Defect.findOne({_id:did});
    },
    allUsers: function(){
        return  Meteor.users.find().fetch();
    },
    images:function(){
        var arr=window.location.pathname.split('/');
        var did=arr[arr.length-2];
        var id= Defect.findOne({_id:did}).attachment;
        return Image.find({_id: id}).fetch();
    },
    comments:function(){
        var arr=window.location.pathname.split('/');
        var id=arr[4];
        return Comment.find({type:'bug','referenceId':id},{sort:{createdAt:-1}}).fetch();
    }
});

Template.defectProcess.events({
    'click .processDefectBtn': function(e) {
        e.preventDefault();
        if(Meteor.userId()){
            var arr=window.location.pathname.split('/');
            var pid=arr[2];
            var id=arr[4];
            var bug=Defect.findOne({_id:id});
            var assign=$('#processassignto option:selected');
            var assignto=assign.text();
            var userid=assign.val();
            //if(bug.assignTo.text==Meteor.user().username){
                var status=$("#selectstatus option:selected").text();
                var operator=bug.assignTo==assignto ?  Meteor.user().username : '由 '+Meteor.user().username+' 分配给 '+assignto;
                Meteor.call('processDefect',id ,status,{'text':assignto,'value':userid},function(err,result){
                    if(err){
                        sAlert.error(err.error);
                    }else{
                        var path=window.location.pathname;
                        path=path.replace('/'+path.split('/')[path.split('/').length-2]+'/process','');
                        window.location=path;
                        var comments=$('#defectcomment').val() ? ' 【评论】：'+$('#defectcomment').val() : '';
                        comments='【状态】：'+status+'。 '+operator+comments;
                        Meteor.call('addComment',pid,id ,comments, 'bug',function(err,result){
                            if(err){
                                sAlert.error(err.error);
                            }
                        });
                        //send email
                        if(assignto!='admin' && status.indexOf('关闭')==-1){
                            var toEmail=Meteor.users.find({_id:userid}).fetch()[0].emails[0].address;
                            var creatorEmail=Meteor.users.find({username:bug.creator}).fetch()[0].emails[0].address;
                            var body='【bug详情】：'+window.location.origin+location.pathname+'  '+comments;
                            Meteor.call("sendEmail",Meteor.user().emails[0].address,[toEmail,creatorEmail],'','【您有1条bug已被处理】'+bug.topic,body,
                                function(err,result){
                                    if(err){
                                        sAlert.error(err.error);
                                    }
                                }
                            );
                        }
                    }
                })
            //}else{
                //e.stopPropagation();
                //sAlert.error('只能由被分配者处理！');
            //}
        }else{
            e.stopPropagation();
            sAlert.error('请先登录！');
        }
    },
    'change #selectstatus': function(e) {
        e.preventDefault();
        e.stopPropagation();
        var options=$('#processassignto')[0];
        if(e.target.value.indexOf('关闭')>0){
            for(var i=0;i<options.length;i++){
                if('admin'==options[i].text){
                    options[i].selected=true;
                    break;
                }
            }
            options.disabled=true;
        }else{
            options.disabled=false;
        }
    }
});


Template.screenshot_create.events({
    'click .upload': function(e, template) {
        var file = $('#fileInput').get(0).files[0];
        Image.insert(file, function (err, fileObj) {
            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
            if(err){
                sAlert.error(err.error);
            }else{
                Session.set('IMAGEID',fileObj._id);
            }
        });
    },
    'click .deleteImage':function(e){
        Image.remove({_id:Session.get('IMAGEID')},function(err){
            if(err){
                sAlert.error(err.error);
            }
        });
    }
});

Template.screenshot_create.helpers({
    images: function () {
        return Image.find({_id: Session.get('IMAGEID')}).fetch();
    }
});
Template.screenshot_update.events({
    'click .upload': function(e, template) {
        var file = $('#fileInput').get(0).files[0];
        if(file){
            Image.insert(file, function (err, fileObj) {
                // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                if(err){
                    sAlert.error(err.error);
                }else{
                    Session.set('IMAGEID',fileObj._id);
                }
            });
        }
    },
    'click .deleteImage':function(e){
        var id=Session.get('IMAGEID');
        if(!id){
            var did=window.location.pathname.split('/')[4];
            id= Defect.findOne({_id:did}).attachment;
        }
        Image.remove({_id: id},function(err){
            if(err){
                sAlert.error(err.error);
            }else{
                Session.set('IMAGEID','');
            }
        });
    }
});

Template.screenshot_update.helpers({
    images: function () {
        var id=Session.get('IMAGEID');
        if(!id){
            var did=window.location.pathname.split('/')[4];
            id= Defect.findOne({_id:did}).attachment;
        }
        return Image.find({_id: id}).fetch();
    }
});