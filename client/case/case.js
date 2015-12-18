/**
 * Created by youyi on 2015/10/19.
 */
Template.caseList.helpers({
    settings: function () {
        return {
            collection: Case,
            rowsPerPage: 30,
            showFilter: true,
            fields: [
                {
                    key: 'name', label: '标题',cellClass: 'col-md-2',sortByValue:true,
                    fn: function (name, object) {
                        var html = '<a class="caseInfo" href="' + location.pathname + '/' + object._id + '">' + name + '</a>';
                        return new Spacebars.SafeString(html);
                    }
                },
                {   key: 'reviewResult', label: '评审结果',cellClass: 'col-md-1',sortByValue:true,
                    fn: function (reviewResult, object) {
                        var html = '<a class="reviewCase" href="' + location.pathname + '/' + object._id + '/review">' + reviewResult + '</a>';
                        return new Spacebars.SafeString(html);
                    }
                },
                {   key: 'testResult', label: '测试结果',cellClass: 'col-md-1',sortByValue:true,
                    fn: function (testResult, object) {
                        var html = '<a class="testCase" href="' + location.pathname + '/' + object._id + '/test">' + testResult + '</a>';
                        return new Spacebars.SafeString(html);
                    }
                },
                {   key: 'feature.text', label: '所属需求',cellClass: 'col-md-2' },
                {   key: 'creator', label: '创建者',cellClass: 'col-md-1' },
                {   key: 'reviewer', label: '评审者',cellClass: 'col-md-1' },
                {   key: 'tester', label: '测试者',cellClass: 'col-md-1' },
//                {   key: 'createdAt', label: '创建时间', cellClass: 'col-md-1', sortOrder: 1, sortDirection: 'descending' },
//                {   key: 'testedAt', label: '测试时间', cellClass: 'col-md-1', sortOrder: 0, sortDirection: 'descending' },
                {   label: '删除',cellClass: 'col-md-1',
                    fn: function (object) {
                        var html = '<span class="glyphicon glyphicon-remove"></span>';
                        return new Spacebars.SafeString(html);
                    }
                }
            ],
            filters:['name','feature.text','testResult','reviewResult']
        };
    },
    features: function () {
        return Feature.find({}).fetch();
    }
});

Template.caseList.events({
    'click .addCaseBtn': function (e) {
        e.preventDefault();
        if(!Meteor.userId()){
            e.stopPropagation();
            sAlert.error('请先登录！');
        }
    },
    'click .addCaseButton': function (e) {
        e.preventDefault();
        var name=$('#casename').val();
        var feature=$("#relatedfeature option:selected");
        var featureValue=feature.val();
        var featureText=feature.text();
        var precondition=$('#precondition').val();
        var steps=$('#steps').val();
        var expectedrespond=$('#expectedrespond').val();
        if(name.replace(/(^s*)|(s*$)/g, "").length!=0 && featureText.replace(/(^s*)|(s*$)/g, "").length!=0 && steps.replace(/(^s*)|(s*$)/g, "").length!=0 && expectedrespond.replace(/(^s*)|(s*$)/g, "").length!=0){
            Meteor.call("addCase",window.location.pathname.split('/')[2], name,{'text':featureText,'value':featureValue},precondition,steps,expectedrespond,function(err,result){
                if(err){
                    sAlert.error(err.error);
                }else{
                    $('#addCaseModal').modal('toggle');
                }
            })
        }else{
            e.stopPropagation();
            sAlert.error('所属需求、标题、测试步骤、验证点不能为空！');
        }
    },
    'click .caseInfo, click .reviewCase': function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.location= e.target.pathname;
    },
    'click .testCase': function(e) {
        e.preventDefault();
        e.stopPropagation();
        if('通过'==e.target.parentNode.previousElementSibling.firstChild.text){
            window.location= e.target.pathname;
        }else{
            sAlert.error('评审未通过无法测试！');
        }
    },
    'click .reactive-table tbody tr': function (e) {
        e.preventDefault();
        var href=e.target.parentNode.parentNode.firstElementChild.childNodes[0].href;
        Session.set('TempRemovingCase',href.split('/')[href.split('/').length-1]);
        if (e.target.className == "glyphicon glyphicon-remove") {
            if(Meteor.userId()) {
                var creator=Case.findOne(Session.get('TempRemovingCase')).creator;
                if(creator==Meteor.user().username){
                    new Confirmation({
                        message: "确定要删除?",
                        title: "确认删除",
                        cancelText: "否",
                        okText: "是",
                        success: true
                    }, function (ok) {
                        if(ok){
                            Meteor.call("removeCase", Session.get('TempRemovingCase'), function (err, result) {
                                if (err) {
                                    sAlert.error(err.error);
                                }else{
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
                    sAlert.error('只能作者才能删除！');
                }
            }else{
                e.stopPropagation();
                sAlert.error('请先登录！');
            }
        }
    }
});


Template.caseEdit.helpers({
    selectedCase: function () {
        var id=window.location.pathname.split('/')[4];
        return Case.findOne({_id:id});
    },
    features: function () {
        return Feature.find({}).fetch();
    }
});

Template.caseEdit.events({
    'click .updateCaseBtn': function(e) {
        e.preventDefault();
        if(Meteor.userId()){
            var name=$('#caseeditname').val();

            var steps=$('#editsteps').val();
            var expectedrespond=$('#editexpectedrespond').val();
            if (name.replace(/(^s*)|(s*$)/g, "").length!=0 && steps.replace(/(^s*)|(s*$)/g, "").length!=0 && expectedrespond.replace(/(^s*)|(s*$)/g, "").length!=0) {
                var feature=$("#editrelatedfeature option:selected");
                var precondition=$('#editprecondition').val();
                var fValue=feature.val();
                var fText=feature.text();
                var cid=window.location.pathname.split('/')[4];

                Meteor.call("updateCase",cid, name, {'text':fText,'value':fValue},precondition,steps,expectedrespond ,function(err,result){
                    if(err){
                        sAlert.error(err.error);
                    }else{
                        var arr=window.location.pathname.split('/');
                        var categorypath='/'+arr[1]+'/'+arr[2]+'/'+arr[3];
                        window.location=categorypath;
                    }
                })
            }else{
                e.stopPropagation();
                sAlert.error('所属需求、标题、测试步骤、验证点不能为空！');
            }
        }else{
            e.stopPropagation();
            sAlert.error('请先登录！');
        }
    }
});

Template.caseReview.events({
    'click .reviewCaseBtn': function(e) {
        e.preventDefault();
        if(Meteor.userId()){
            var creator=$('.creatorLabel').text();
            if(creator!=Meteor.user().username){
                var reviewresult=$('#setReviewResult option:selected').text();
                Meteor.call('reviewCase',window.location.pathname.split('/')[4] ,reviewresult ,function(err,result){
                    if(err){
                        sAlert.error(err.error);
                    }else{
                        var arr=window.location.pathname.split('/');
                        var categorypath='/'+arr[1]+'/'+arr[2]+'/'+arr[3];
                        var pid=arr[2];
                        window.location=categorypath;
                        var comments=$('#reviewcomment').val();
                        if(comments){
                            Meteor.call('addComment',pid,arr[4] ,comments, 'review',function(err,result){
                                if(err){
                                    sAlert.error(err.error);
                                }
                            })
                        }
                    }
                })
            }else{
                e.stopPropagation();
                sAlert.error('不能评审自己创建的用例！');
            }
        }else{
            e.stopPropagation();
            sAlert.error('请先登录！');
        }
    }
});

Template.caseTest.events({
    'click .caseTestBtn': function(e) {
        e.preventDefault();
        if(Meteor.userId()){
            var testresult=$('#setTestResult option:selected').text();
            Meteor.call('testCase',window.location.pathname.split('/')[4] ,testresult ,function(err,result){
                if(err){
                    sAlert.error(err.error);
                }else{
                    var arr=window.location.pathname.split('/');
                    var categorypath='/'+arr[1]+'/'+arr[2]+'/'+arr[3];
                    window.location=categorypath;
                    var pid=arr[2];
                    var comments=$('#testcomment').val();
                    Meteor.call('addComment',pid,window.location.pathname.split('/')[4] ,testresult+'。 '+comments, 'test',function(err,result){
                        if(err){
                            sAlert.error(err.error);
                        }
                    })
                }
            })
        }else{
            e.stopPropagation();
            sAlert.error('请先登录！');
        }
    }
});

Template.caseReview.helpers({
    selectedCase: function () {
        var id=window.location.pathname.split('/')[4];
        return Case.findOne({_id:id});
    },
    comments: function(){
        return Comment.find({referenceId: window.location.pathname.split('/')[4],type:'review'},{sort:{createdAt:-1}}).fetch();
    }
});
Template.caseReadOnly.helpers({
    selectedCase: function () {
        var id=window.location.pathname.split('/')[4];
        return Case.findOne({_id:id});
    }
});

Template.caseTest.helpers({
    selectedCase: function () {
        var id=window.location.pathname.split('/')[4];
        return Case.findOne({_id:id});
    },
    comments: function(){
        return Comment.find({referenceId: window.location.pathname.split('/')[4],type:'test'},{sort:{createdAt:-1}}).fetch();
    }
});







