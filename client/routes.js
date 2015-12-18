/**
 * Created by youyi on 2015/10/14.
 */
Router.route('/', function () {
    this.layout('applicationLayout');
    this.render('home');
});

Router.route('/project', function () {
    this.layout('applicationLayout');
    this.render('home');
});

/**
 * to:'XX' means {{> yield XX}}
 */
Router.route('/project/:_id', function () {
    this.layout('project');
    this.render('info',{to:'info'});
});

Router.route('/project/:_id/feature', function () {
    this.layout('project');
    this.render('featureList',{to:'featureList'});
});

Router.route('/project/:_id/feature/:_id', function () {
    this.layout('project');
    this.render('featureEdit',{to:'featureEdit'});
});

Router.route('/project/:_id/case', function () {
    this.layout('project');
    this.render('caseList',{to:'caseList'});
});

Router.route('/project/:_id/case/:_id', function () {
    this.layout('project');
    this.render('caseEdit',{to:'caseEdit'});
});

Router.route('/project/:_id/case/:_id/review', function () {
    this.layout('project');
    this.render('caseReview',{to:'caseReview'});
});

Router.route('/project/:_id/case/:_id/test', function () {
    this.layout('project');
    this.render('caseTest',{to:'caseTest'});
});

Router.route('/project/:_id/defect', function () {
    this.layout('project');
    this.render('defectList',{to:'defectList'});
});

Router.route('/project/:_id/defect/:_id', function () {
    this.layout('project');
    this.render('defectEdit',{to:'defectEdit'});
});

Router.route('/project/:_id/defect/:_id/process', function () {
    this.layout('project');
    this.render('defectProcess',{to:'defectProcess'});
});

Router.route('/project/:_id/risk', function () {
    this.layout('project');
    this.render('risk',{to:'risk'});
});

Router.route('/project/:_id/metrics', function () {
    this.layout('project');
    this.render('metrics',{to:'metrics'});
});

Router.route('/project/:_id/access', function () {
    this.layout('project');
    this.render('access',{to:'access'});
});

Router.route('/me', function () {
    if(Meteor.userId()){
        this.layout('me');
        this.render('me',{to:'me'});
    }else{
        this.layout('applicationLayout');
        this.render('home');
    }
});

Router.route('/me/defectassigned', function () {
    if(Meteor.userId()){
        this.layout('me');
        this.render('defectAssigned',{to:'defectAssigned'});
    }else{
        this.layout('applicationLayout');
        this.render('home');
    }
});

Router.route('/me/defectcreated', function () {
    if(Meteor.userId()){
        this.layout('me');
        this.render('defectCreated',{to:'defectCreated'});
    }else{
        this.layout('applicationLayout');
        this.render('home');
    }
});

Router.route('/summary', function () {
    this.layout('applicationLayout');
    this.render('home');
});

Router.route('/summary/quality', function () {
    this.layout('summary');
    this.render('quality',{to:'quality'});
});

Router.route('/summary/defecttodo', function () {
    this.layout('summary');
    this.render('defectTodoList',{to:'defectTodoList'});
});

Router.route('/summary/defecttrend', function () {
    this.layout('summary');
    this.render('defectTrend',{to:'defectTrend'});
});

//Router.route('/summary/testtrend', function () {
//    this.layout('summary');
//    this.render('testTrend',{to:'testTrend'});
//});