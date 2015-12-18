/**
 * Created by youyi on 2015/11/24.
 */
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

Template.metrics.helpers({
    projectDefectTrendLineChart: function () {
        return getLineChart('缺陷汇总',Session.get('PRJXAXIS'),'数量',Session.get('PRJDEFECTINFO'));
    }
});

Meteor.call("getDefectInfoWithinMonth",location.pathname.split('/')[2],function(err,data){
    if(err){
        Session.setPersistent('PRJXAXIS',[]);
        Session.setPersistent('PRJDEFECTINFO',[]);
    }else{
        var arr=[
            {name:'总数',data:[]},
            {name:'今日关闭',data:[]},
            {name:'今日新增',data:[]}
        ];
        var xarr=[];
        _.each(data,function(obj){
            xarr.push(obj.date);
            arr[0].data.push(obj.info.total);
            arr[1].data.push(obj.info.todayClosed);
            arr[2].data.push(obj.info.todayCreated);
        });
        Session.setPersistent('PRJXAXIS',xarr);
        Session.setPersistent('PRJDEFECTINFO',arr);
    }
});
