/**
 * Created by youyi on 2015/10/15.
 */
Template.featureList.helpers({
    settings: function () {
        return {
            collection: Feature,
            rowsPerPage: 30,
            showFilter: true,
            fields: [
                {
                    key: 'name',
                    label: '名称',
                    cellClass: 'col-md-6',
                    sortByValue:true,
                    fn: function (name, object) {
                        var html = '<a class="featureInfo" href="' + location.pathname + '/' + object._id + '">' + name + '</a>';
                        return new Spacebars.SafeString(html);
                    }
                },
                {   key: 'priority', label: '优先级',
                    cellClass: 'col-md-1'
                },
                {   key: 'frequencyOfFailure.text', label: '出错频率',cellClass: 'col-md-1' },
                {   key: 'impact.text', label: '影响程度',cellClass: 'col-md-1' },
                {   key: 'creator', label: '创建人',cellClass: 'col-md-1' },
                {   label: '删除',cellClass: 'col-md-1',
                    fn: function (object) {
                        var html = '<span class="glyphicon glyphicon-remove"></span>';
                        return new Spacebars.SafeString(html);
                    }
                }
            ],
            filters:['name','creator']
        };
    }
});


Template.featureList.events({
    'click .reactive-table tbody tr': function (e) {
        e.preventDefault();
        var href=e.target.parentNode.parentNode.firstElementChild.childNodes[0].href;
        Session.set('TempRemovingFeature',href.split('/')[href.split('/').length-1]);
        if (e.target.className == "glyphicon glyphicon-remove") {
            if(Meteor.userId()){
                var creator=Feature.findOne(Session.get('TempRemovingFeature')).creator;
                if(creator==Meteor.user().username){
                    new Confirmation({
                        message: "确定要删除?",
                        title: "确认删除",
                        cancelText: "否",
                        okText: "是",
                        success: true
                    }, function (ok) {
                        if(ok){
                            Meteor.call("removeFeature", Session.get('TempRemovingFeature'),function(err,result){
                                if(err){
                                    sAlert.error(err.error);
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
    },
    'click .addFeatureBtn': function (e) {
        e.preventDefault();
        if(!Meteor.userId()){
            e.stopPropagation();
            sAlert.error('请先登录！');
        }
    },
    'click .addFeaBtn': function (e) {
        e.preventDefault();
        var name=$('#featurename').val();
        var fof=$("#fof option:selected");
        var impact=$("#impact option:selected");
        var fofValue=Number(fof.val());
        var fofText=fof.text();
        var impactValue=Number(impact.val());
        var impactText=impact.text();
        if(name.replace(/(^s*)|(s*$)/g, "").length!=0 && 0!=fofValue && 0!=impactValue){
            var pid=window.location.pathname.split('/')[2];
            Meteor.call("addFeature",pid, name,{'text':fofText,'value':fofValue}, {'text':impactText,'value':impactValue},function(err,result){
                if(err){
                    sAlert.error(err.error);
                }else{
                    $('#addFeatureModal').modal('toggle');
                }
            })
        }else{
            e.stopPropagation();
            sAlert.error('名称、出错频率、影响程度不能为空！');
        }
    },
    'click .featureInfo': function(e) {
        e.preventDefault();
        e.stopPropagation();
        var path=e.target.pathname;
//        Session.setPersistent('SELECTEDFEATUREID',path.split('/')[path.split('/').length-1]);
        window.location= path;
    }
});

Template.featureEdit.helpers({
    selectedFeature: function () {
        var fid=window.location.pathname.split('/')[4];
        return Feature.findOne(fid);
    }

});

Template.featureEdit.events({
    'click .updateFeatureBtn': function(e) {
        e.preventDefault();
        if(Meteor.userId()){
            var name=$('#featureeditname').val();
            if (name.replace(/(^s*)|(s*$)/g, "").length!=0) {
                var fof=$("#bindFof option:selected");
                var impact=$("#bindImpact option:selected");
                var fofValue=Number(fof.val());
                var fofText=fof.text();
                var impactValue=Number(impact.val());
                var impactText=impact.text();
                var fid=window.location.pathname.split('/')[4];

                Meteor.call("updateFeature",fid, name, {'text':fofText,'value':fofValue}, {'text':impactText,'value':impactValue},function(err,result){
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
                sAlert.error('需求简述、出错频率、影响程度不能为空！');
            }
        }else{
            e.stopPropagation();
            sAlert.error('请先登录！');
        }
    }
});