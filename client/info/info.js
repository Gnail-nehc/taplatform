/**
 * Created by youyi on 2015/10/16.
 */
Template.info.helpers({
    featurePieChart:function(){
        return getPieChart('测试需求优先级分布饼图',Feature.find({}).count(),Session.get('TESTREQINFO'));
    },
    caseReviewPieChart:function(){
        return getPieChart('测试用例评审状态饼图',Case.find({}).count(),Session.get('CASEREVIEWINFO'));
    },
    caseTestPieChart:function(){
        return getPieChart('测试结果分布饼图',Case.find({}).count(),Session.get('CASETESTINFO'));
    },
    defectStatusPieChart:function(){
        return getPieChart('缺陷状态分布饼图',Defect.find({}).count(),Session.get('BUGSTATUSINFO'));
    },
    defectPriorityPieChart:function(){
        return getPieChart('缺陷优先级分布饼图',Defect.find({}).count(),Session.get('BUGPRIORITYINFO'));
    }

});

function getPieChart(title,count,data){
    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: title+'<br>总数：'+count
        },
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [
            {
                type: 'pie',
                name: '占比',
                data: data
            }
        ]
    }
}

Meteor.call("getFeatureDistribution",window.location.pathname.split('/')[2],function(err,data){
    if(err){
        Session.setPersistent('TESTREQINFO',[]);
    }else{
        var arr=[];
        _.each(data,function(element){
            arr.push({name:element._id+'<br>数量：'+element.count,y:element.count,color:'#'+ Math.floor(Math.random()*16777215).toString(16)})
        });
        Session.setPersistent('TESTREQINFO',arr);
    }
});
Meteor.call("getCaseReviewDistribution",window.location.pathname.split('/')[2],function(err,data){
    if(err){
        Session.setPersistent('CASEREVIEWINFO',[]);
    }else{
        var arr=[];
        _.each(data,function(element){
            arr.push({name:element._id+'<br>数量：'+element.count,y:element.count,color:'#'+ Math.floor(Math.random()*16777215).toString(16)})
        });
        Session.setPersistent('CASEREVIEWINFO',arr);
    }
});
Meteor.call("getCaseTestDistribution",window.location.pathname.split('/')[2],function(err,data){
    if(err){
        Session.setPersistent('CASETESTINFO',[]);
    }else{
        var arr=[];
        _.each(data,function(element){
            arr.push({name:element._id+'<br>数量：'+element.count,y:element.count,color:'#'+ Math.floor(Math.random()*16777215).toString(16)})
        });
        Session.setPersistent('CASETESTINFO',arr);
    }
});
Meteor.call("getDefectStatusDistribution",window.location.pathname.split('/')[2],function(err,data){
    if(err){
        Session.setPersistent('BUGSTATUSINFO',[]);
    }else{
        var arr=[];
        _.each(data,function(element){
            arr.push({name:element._id+'<br>数量：'+element.count,y:element.count,color:'#'+ Math.floor(Math.random()*16777215).toString(16)})
        });
        Session.setPersistent('BUGSTATUSINFO',arr);
    }
});
Meteor.call("getDefectPriorityDistribution",window.location.pathname.split('/')[2],function(err,data){
    if(err){
        Session.setPersistent('BUGPRIORITYINFO',[]);
    }else{
        var arr=[];
        _.each(data,function(element){
            arr.push({name:element._id+'<br>数量：'+element.count,y:element.count,color:'#'+ Math.floor(Math.random()*16777215).toString(16)})
        });
        Session.setPersistent('BUGPRIORITYINFO',arr);
    }
});












