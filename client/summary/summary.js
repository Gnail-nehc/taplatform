/**
 * Created by youyi on 2015/11/23.
 */
Template.summary.events({
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

Template.summary.helpers({
    header: function(){
        var path=location.pathname;
        path = path.substr(path.length,1)!='/' ? path.split('/')[path.split('/').length-1]:path.split('/')[path.split('/').length-2];
        if('quality'==path){
            return '质量总览';
        }else if('defecttrend'==path){
            return '每日缺陷实时统计';
        }
//        else if('testtrend'==path){
//            return '每日测试进度实时统计';
//        }
        else if('defecttodo'==path){
            return '“新建”、“验证不通过打回”、“已修复待验证”缺陷处理人列表';
        }
    }
});

Template.quality.helpers({
    qualityInfo: function(){
        return Session.get('QUALITYINFO');
    },
    settings: function () {
        return {
            rowsPerPage: 80,
            showFilter:false,
            fields: [
                {   key: 'project', label: '项目名称',cellClass: 'col-md-1' },
                {   key: 'totalDefectCount', label: '缺陷总数',cellClass: 'col-md-1' },
                {   key: 'newDefectCount', label: '未处理',cellClass: 'col-md-1' },
                {   key: 'fixedDefectCount', label: '已修复待验证',cellClass: 'col-md-1' },
                {   key: 'verifiedDefectCount', label: '验证通过关闭',cellClass: 'col-md-1' },
                {   key: 'failedDefectCount', label: '验证失败打开',cellClass: 'col-md-1' },
                {   key: 'notDefectCount', label: '不是缺陷关闭',cellClass: 'col-md-1' },
                {   key: 'duplicatedDefectCount', label: '重复缺陷关闭',cellClass: 'col-md-1' },
                {   key: 'delayDefectCount', label: '延期处理关闭',cellClass: 'col-md-1' },
                {   key: 'totalCaseCount', label: '用例总数',cellClass: 'col-md-1' },
                {   key: 'untestCaseCount', label: '待测',cellClass: 'col-md-1 ' },
                {   key: 'passCaseCount', label: '通过',cellClass: 'col-md-1' },
                {   key: 'failCaseCount', label: '失败',cellClass: 'col-md-1' },
                {   key: 'testProgress', label: '测试进度',cellClass: 'col-md-1' }
            ]
        };
    }
});

Template.defectTodoList.helpers({
    defectTodoList: function(){
        return Session.get('DEFECTTODO');
    },
    settings: function () {
        return {
            rowsPerPage: 80,
            showFilter:false,
            fields: [
                {   key: 'username', label: '处理人',cellClass: 'col-md-1' },
                {   key: 'count', label: '缺陷数',cellClass: 'col-md-1',sortByValue:true,
                    fn: function (count, object) {
                        var html = '<a class="defectForUser" href="#openDefectModal" data-toggle="modal" role="button">' + count + '</a>';
                        return new Spacebars.SafeString(html);
                    }
                }
            ]
        };
    },
    defectTodoWithUser: function(){
        return Session.get('DEFECTTODOWITHUSER');
    },
    settingsModal: function () {
        return {
            rowsPerPage: 30,
            showFilter: false,
            fields: [
                {   key: 'topic',label: '标题',cellClass: 'col-md-3' },
                {   key: 'feature.text', label: '所属需求',cellClass: 'col-md-1' },
                {   key: 'status', label: '状态',cellClass: 'col-md-1',sortByValue:true,
                    fn: function (status, object) {
                        var html = '<a class="processDefect" href="/project/'+object.pid+'/defect/'+object._id+'/process">' + status + '</a>';
                        return new Spacebars.SafeString(html);
                    }
                },
                {   key: 'priority', label: '优先级',cellClass: 'col-md-1'},
                {   key: 'severity', label: '严重程度',cellClass: 'col-md-1'},
                {   key: 'creator', label: '报告者',cellClass: 'col-md-1' },
                {   key: 'assignTo.text', label: '处理者',cellClass: 'col-md-1' },
                {   key: 'createdAt', label: '创建时间',cellClass: 'col-md-1' },
                {   key: 'updatedAt', label: '更新时间',cellClass: 'col-md-1' }
            ]
        };
    }
});

Template.defectTodoList.events({
    "click .defectForUser": function (e) {
        var username=e.target.parentNode.parentNode.children[0].textContent;
        Meteor.call("getDefectTodoForUser",username,function(err,data){
            if(err){
                e.preventDefault();
                e.stopPropagation();
                Session.setPersistent('DEFECTTODOWITHUSER',[]);
            }else{
                Session.setPersistent('DEFECTTODOWITHUSER',data);
            }
        });
    }
});


function getLineChart(title,xArr,yTitle,datatable){
    return  {
        chart: {
            type: 'line'
        },
        title: {
            text: title+'实时统计'
        },
        subtitle: {
            text: '至多显示30天'
        },
        xAxis: {
            categories: xArr
        },
        yAxis: {
            title: {
                text: yTitle
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: datatable
    }
};

Template.defectTrend.defectTrendLineChart = function() {
    return getLineChart('每日缺陷状态',Session.get('XAXIS'),'数量',Session.get('DEFECTINFO'));
};

//Template.testTrend.testTrendLineChart = function() {
//    return getLineChart('每日测试进度',Session.get('XAXIS'),'百分比（%）',Session.get('TESTINFO'));
//};

Meteor.call("getDefectAndCaseInfo",function(err,data){
    if(err){
        Session.setPersistent('QUALITYINFO',[]);
    }else{
        var arr=[];
        var bugInfos=data.defectInfoList;
        var caseUntest=data.caseUntestInfoList;
        var casePass=data.casePassInfoList;
        var caseFail=data.caseFailInfoList;
        var projects=data.projects;
        _.each(projects,function(p){
            var news=0,fixed=0,verified=0,failed=0,no=0,duplicated=0,delay=0,untest=0,pass=0,fail=0;
            _.each(bugInfos,function(b){
                if(b._id.pid== p._id){
                    var count=parseInt(b.count);
                    if(b._id.status=='新建'){
                        news=count;
                    }else if(b._id.status=='已修复待验证'){
                        fixed=count;
                    }else if(b._id.status=='验证通过并关闭'){
                        verified=count;
                    }else if(b._id.status=='验证不通过打回'){
                        failed=count;
                    }else if(b._id.status=='不是缺陷并关闭'){
                        no=count;
                    }else if(b._id.status=='重复缺陷并关闭'){
                        duplicated=count;
                    }else{
                        delay=count;
                    }
                }
            });
            for(var i=0;i<caseUntest.length;i++){
                if(caseUntest[i]._id.pid== p._id){
                    var count=parseInt(caseUntest[i].count);
                    untest=count;
                    break;
                }
            }
            for(var i=0;i<casePass.length;i++){
                if(casePass[i]._id.pid== p._id){
                    var count=parseInt(casePass[i].count);
                    pass=count;
                    break;
                }
            }
            for(var i=0;i<caseFail.length;i++){
                if(caseFail[i]._id.pid== p._id){
                    var count=parseInt(caseFail[i].count);
                    fail=count;
                    break;
                }
            }
            var sum=parseInt(untest+pass+fail);
            arr.push({
                project:p.name,
                totalDefectCount:news+fixed+verified+failed+no+duplicated+delay,
                newDefectCount:news,
                fixedDefectCount:fixed,
                verifiedDefectCount:verified,
                failedDefectCount:failed,
                notDefectCount:no,
                duplicatedDefectCount:duplicated,
                delayDefectCount:delay,
                totalCaseCount:sum,
                untestCaseCount:untest,
                passCaseCount:pass,
                failCaseCount:fail,
                testProgress:sum!=0?parseInt((pass+fail)/sum*100)+'%':'无用例'
            })
        });
        Session.setPersistent('QUALITYINFO',arr);
    }
});

Meteor.call("getDefectInfoWithinMonth",function(err,data){
    if(err){
        Session.setPersistent('XAXIS',[]);
        Session.setPersistent('DEFECTINFO',[]);
    }else{
        var arr=[
            {name:'总数',data:[]},
            {name:'未关闭',data:[]},
            {name:'今日关闭',data:[]},
            {name:'未修复（包括验证失败）',data:[]},
            {name:'今日新增',data:[]},
            {name:'P0未修复（包括验证失败）',data:[]}
        ];
        var xarr=[];
        _.each(data,function(obj){
            xarr.push(obj.date);
            arr[0].data.push(obj.info.total);
            arr[1].data.push(obj.info.unclosed);
            arr[2].data.push(obj.info.todayClosed);
            arr[3].data.push(obj.info.unresolved);
            arr[4].data.push(obj.info.todayCreated);
            arr[5].data.push(obj.info.p0unresolved);
        });
        Session.setPersistent('XAXIS',xarr);
        Session.setPersistent('DEFECTINFO',arr);
    }
});

//Meteor.call("getTestInfoWithinMonth",function(err,data){
//    if(err){
//        Session.setPersistent('XAXIS',[]);
//        Session.setPersistent('TESTINFO',[]);
//    }else{
//        var arr=[
//            {name:'测试进度',data:[]},
//            {name:'测试通过率',data:[]}
//        ];
//        var xarr=[];
//        _.each(data,function(obj){
//            var pass=0,fail= 0;
//            xarr.push(obj.date);
//            var total=parseInt(obj.total);
//            if(total==0){
//                arr[0].data.push(0);
//                arr[1].data.push(0);
//            }else{
//                _.each(obj.info,function(statistics){
//                    var result=statistics._id.testResult;
//                    var count=parseInt(statistics.count);
//                    if(result=='成功'){
//                        pass+=count;
//                    }else if(result=='失败'){
//                        fail+=count;
//                    }
//                });
//                arr[0].data.push(parseInt((pass+fail)/total*100));
//                arr[1].data.push(parseInt(pass/total*100));
//            }
//        });
//        Session.setPersistent('XAXIS',xarr);
//        Session.setPersistent('TESTINFO',arr);
//    }
//});

Meteor.call("getDefectTodoList",function(err,data){
    if(err){
        Session.setPersistent('DEFECTTODO',[]);
    }else{
        var arr=[];
        _.each(data,function(obj){
            arr.push({
                username:obj._id.username,
                count:obj.count
            });
        });
        Session.setPersistent('DEFECTTODO',arr);
    }
});