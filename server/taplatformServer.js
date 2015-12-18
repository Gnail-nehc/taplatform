/**
 * Created by youyi on 2015/10/12.
 */
Meteor.startup(function () {
    // code to run on server at startup
    process.env.MAIL_URL="smtp://node_mailer:jbbdlqlsaecpdaca@smtp.126.com:465/";
    SyncedCron.start();
});



Meteor.publish("findAllProjects", function () {
    return Project.find();
});
Meteor.publish("findFeaturesInProject", function (pid) {
    return Feature.find({pid:pid},{sort:{name:1}});
});
Meteor.publish("findCasesInProject", function (pid) {
    return Case.find({pid:pid});
});
Meteor.publish("findComments", function (pid) {
    return Comment.find({pid:pid});
});
Meteor.publish("findImages", function () {
    return Image.find();
});
Meteor.publish("findDefectsInProject", function (pid) {
    return Defect.find({pid:pid});
});
Meteor.publish("findAllUsers", function () {
    return Meteor.users.find({},{sort:{username:1}});
});




Meteor.methods({
    addProject: function (name,description) {
        if(Meteor.user()){
            var today = new Date();
            var m=today.getMonth()+1;
            var d=today.getDate();
            if (m < 10 )
                m = "0" + m;
            if (d < 10 )
                d = "0" + d;
            var date=today.getFullYear()+"-"+m+"-"+d;
            Project.insert({
                name: name,
                description: description,
                createdAt:date+' '+new Date().toLocaleTimeString(),
                creator: Meteor.user().username
            });
        }
    },
    addFeature: function (pid,name,fof, impact) {
        if(Meteor.user()){
            Feature.insert({
                pid:pid,
                name: name,
                frequencyOfFailure: fof,
                impact: impact,
                creator: Meteor.user().username,
                priority: (fof.value+impact.value)/2
            });
        }
    },
    updateFeature: function (id,name,fof, impact) {
        if(Meteor.user()){
            Feature.update(id,{$set:{
                name:name,
                frequencyOfFailure: fof,
                impact: impact,
                creator: Meteor.user().username,
                priority: (fof.value+impact.value)/2
            }});
        }
    },
    removeFeature:function(id){
        Feature.remove(id);
    },
    addCase: function (pid,name,feature,precondition,steps,expectedrespond) {
        var today = new Date();
        var m=today.getMonth()+1;
        var d=today.getDate();
        if (m < 10 )
            m = "0" + m;
        if (d < 10 )
            d = "0" + d;
        var date=today.getFullYear()+"-"+m+"-"+d;
        if(Meteor.user()){
            Case.insert({
                pid: pid,
                name: name,
                feature:feature,
                precondition:precondition,
                steps:steps,
                expectedRespond:expectedrespond,
                creator: Meteor.user().username,
                createdAt:date+' '+new Date().toLocaleTimeString(),
                reviewResult:'待评审',
                testResult:'待测试'
            });
        }
    },
    updateCase: function (cid,name,feature,precondition,steps,expectedrespond) {
        Case.update(cid,{$set:{
            name: name,
            feature:feature,
            precondition:precondition,
            steps:steps,
            expectedRespond:expectedrespond
        }});
    },
    reviewCase: function (cid,reviewresult) {
        if(Meteor.user()){
            Case.update(cid,{$set:{
                reviewResult:reviewresult,
                reviewer:Meteor.user().username
            }});
        }
    },
    testCase: function (cid,testresult) {
        var today = new Date();
        var m=today.getMonth()+1;
        var d=today.getDate();
        if (m < 10 )
            m = "0" + m;
        if (d < 10 )
            d = "0" + d;
        var date=today.getFullYear()+"-"+m+"-"+d;
        if(Meteor.user()){
            Case.update(cid,{$set:{
                testResult:testresult,
                tester:Meteor.user().username,
                testedAt:date+' '+new Date().toLocaleTimeString()
            }});
        }
    },
    addComment:function (pid,refid,content,type){
        var today = new Date();
        var m=today.getMonth()+1;
        var d=today.getDate();
        if (m < 10 )
            m = "0" + m;
        if (d < 10 )
            d = "0" + d;
        var date=today.getFullYear()+"-"+m+"-"+d;
        if(Meteor.user()){
            Comment.insert({
                pid:pid,
                referenceId:refid,
                type: type,
                creator: Meteor.user().username,
                content:content,
                createdAt:date+' '+new Date().toLocaleTimeString()
            });
        }
    },
    removeCommentByReferenceId:function(pid,refid){
        Comment.remove({pid:pid,referenceId:refid});
    },
    removeCase:function(id){
        Case.remove(id);
    },

    addDefect:function (pid,feature,topic,precondition,steps,expected,actual,severity,priority,attachment,assignTo){
        var today = new Date();
        var m=today.getMonth()+1;
        var d=today.getDate();
        if (m < 10 )
            m = "0" + m;
        if (d < 10 )
            d = "0" + d;
        var date=today.getFullYear()+"-"+m+"-"+d;
        if(Meteor.user()){
            Defect.insert({
                pid:pid,
                feature: feature,
                topic: topic,
                precondition: precondition,
                steps: steps,
                expectedRespond: expected,
                actualRespond: actual,
                severity: severity,
                priority: priority,
                status: '新建',
                attachment: attachment,
                creator:Meteor.user().username,
                assignTo: assignTo,
                createdAt: date+' '+new Date().toLocaleTimeString()
            });
        }
    },
    removeDefect:function(id){
        Defect.remove(id);
    },
    updateDefect:function(did,feature,topic,precondition,steps,expected,actual,severity,priority,attachment,assignTo){
        Defect.update(did,{$set:{
            topic: topic,
            feature:feature,
            precondition:precondition,
            steps:steps,
            expectedRespond:expected,
            actualRespond:actual,
            severity:severity,
            priority:priority,
            attachment:attachment,
            assignTo:assignTo
        }});
    },
    processDefect:function(did,status,assignto){
        var today = new Date();
        var m=today.getMonth()+1;
        var d=today.getDate();
        if (m < 10 )
            m = "0" + m;
        if (d < 10 )
            d = "0" + d;
        var date=today.getFullYear()+"-"+m+"-"+d;
        Defect.update(did,{$set:{
            status:status,
            assignTo:assignto,
            updatedAt:date+' '+new Date().toLocaleTimeString()
        }});
    },
    sendEmail: function (from, to, cc, subject, text) {
        //check([to, from, subject, text], [String]);
        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Email.send({
            to: to,
            from: 'node_mailer@126.com',
            cc: [from,cc],
            subject: subject,
            text: text
        });
    },
    getFeatureDistribution:function(pid){
        return Feature.aggregate([{ $match : {pid : pid } },{ $group : { _id : "$priority", count: { $sum: 1 } } }]);
    },
    getCaseReviewDistribution:function(pid){
        return Case.aggregate([{ $match : {pid : pid } },{ $group : { _id : "$reviewResult", count: { $sum: 1 } } }]);
    },
    getCaseTestDistribution:function(pid){
        return Case.aggregate([{ $match : {pid : pid } },{ $group : { _id : "$testResult", count: { $sum: 1 } } }]);
    },
    getDefectStatusDistribution:function(pid){
        return Defect.aggregate([{ $match : {pid : pid } },{ $group : { _id : "$status", count: { $sum: 1 } } }]);
    },
    getDefectPriorityDistribution:function(pid){
        return Defect.aggregate([{ $match : {pid : pid } },{ $group : { _id : "$priority", count: { $sum: 1 } } }]);
    },
    findDefectsAssignToMe:function(){
        return Defect.find({'assignTo.value':this.userId}).fetch();
    },
    findDefectsCreatedByMe:function(){
        var user=Meteor.users.findOne(this.userId);
        if(user){
            return Defect.find({creator:user.username}).fetch();
        }else{
            return [];
        }
    },
    getDefectAndCaseInfo:function(){
        var obj={};
        obj.projects=Project.find({},{name:1}).fetch();
        obj.defectInfoList=Defect.aggregate([{$group:{ _id:{pid:"$pid",status:"$status"},count: { $sum: 1 } }}]);
        obj.caseUntestInfoList=Case.aggregate([{$match: {'testResult' : '待测试'}},{$group:{ _id:{pid:"$pid"},count: { $sum: 1 } }}]);
        obj.casePassInfoList=Case.aggregate([{$match: {'testResult' : '成功'}},{$group:{ _id:{pid:"$pid"},count: { $sum: 1 } }}]);
        obj.caseFailInfoList=Case.aggregate([{$match: {'testResult' : '失败'}},{$group:{ _id:{pid:"$pid"},count: { $sum: 1 } }}]);
        return obj;
    },
    getDefectInfoWithinMonth:function(pid){
        var arr=[];
        for(var i=29;i>=0;i--){
            var today = new Date();
            today.setDate(today.getDate()-i);
            var m=today.getMonth()+1;
            var d=today.getDate();
            if (m < 10 )
                m = "0" + m;
            if (d < 10 )
                d = "0" + d;
            var date=today.getFullYear()+"-"+m+"-"+d;
            var condition=!pid ? {updatedAt:{$regex:date}, status:{$nin:['新建','验证不通过打回','已修复待验证']}} : {pid:pid,updatedAt:{$regex:date}, status:{$nin:['新建','验证不通过打回','已修复待验证']}};
            var todayClosed=Defect.find(condition).count();
            condition=!pid ? {createdAt: {$regex:date}} : {pid:pid,createdAt: {$regex:date}};
            var todayCreated=Defect.find(condition).count();
            condition=!pid ? {createdAt: {$lte:date}} : {pid:pid,createdAt: {$lte:date}};
            var total=Defect.find(condition).count();
            var defectMining=DefectMining.findOne({date:date});
            var info={
                'total':total,
                'todayClosed':todayClosed,
                'todayCreated':todayCreated,
                'unclosed':defectMining ? defectMining.unclosed : 0,
                'unresolved':defectMining ? defectMining.unresolved : 0,
                'p0unresolved':defectMining ? defectMining.p0unresolved : 0
            };
            arr.push({date:date,info:info});
        }
        return arr;
    },
//    getTestInfoWithinMonth:function(pid){
//        var arr=[];
//        for(var i=29;i>=0;i--){
//            var info=[];
//            var total=0;
//            var today = new Date();
//            today.setDate(today.getDate()-i);
//            var m=today.getMonth()+1;
//            var d=today.getDate();
//            if (m < 10 )
//                m = "0" + m;
//            if (d < 10 )
//                d = "0" + d;
//            var date=today.getFullYear()+"-"+m+"-"+d;
//            var condition;
//            if(!pid){
//                total=Case.find({'createdAt' : { '$lte' : date+ ' 23:59:59' }}).count();
//                condition={testedAt:{ '$lte' : date+ ' 23:59:59' } };
//            }else{
//                total=Case.find({pid:pid},{'createdAt' : { '$lte' : date+ ' 23:59:59' }}).count();
//                condition={pid:pid,testedAt:{ '$lte' : date+ ' 23:59:59' } }
//            }
//            if(parseInt(total)!=0){
//                info=Case.aggregate([{$match: condition},{$group:{ _id:{testResult:"$testResult"},count: { $sum: 1 }}}]);
//            }
//            arr.push({date:date,total:total,info:info});
//        }
//        return arr;
//    },
    getDefectTodoList:function(){
        return Defect.aggregate([{$match: {'status' : {$in:['新建','验证不通过打回','已修复待验证']}}},{$group:{ _id:{username:'$assignTo.text'},count: { $sum: 1 }}}, { $sort: { count: -1 } }]);
    },
    getDefectTodoForUser:function(username){
        return Defect.find({'status' : {$in:['新建','验证不通过打回','已修复待验证']},'assignTo.text':username}).fetch();
    }
});


SyncedCron.add({
    name: 'defect mining',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 3 hours');
    },
    job: function(intendedAt) {
        var today = new Date();
        var m=today.getMonth()+1;
        var d=today.getDate();
        if (m < 10 )
            m = "0" + m;
        if (d < 10 )
            d = "0" + d;
        var date=today.getFullYear()+"-"+m+"-"+d;
        var condition={createdAt:{'$lte':date+ ' 23:59:59'},status: {$in:['新建','验证不通过打回','已修复待验证']}};
        var unclosed=Defect.find(condition).count();
        condition={createdAt:{'$lte':date+ ' 23:59:59'},status: {$in:['新建','验证不通过打回']}};
        var unresolved=Defect.find(condition).count();
        condition={createdAt:{'$lte':date+ ' 23:59:59'},status: {$in:['新建','验证不通过打回']},priority:'P0'};
        var p0unresolved=Defect.find(condition).count();
        if(DefectMining.find({date:date}).count()!=0){
            DefectMining.update({date:date},{$set:{unclosed:unclosed,unresolved:unresolved,p0unresolved:p0unresolved}});
        }else{
            DefectMining.insert({
                date:date,
                unclosed:unclosed,
                unresolved:unresolved,
                p0unresolved:p0unresolved
            });
        }
    }
});