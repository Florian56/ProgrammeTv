
module.exports = {
    
    folderName: 'ProgrammeTv',
    // Inject Boxs in dashboard
    // dashboadBoxs is an array of dashboardBox 
    dashboardBoxs: [{
        title: 'Programme TV',
        // the name of your Angular Controller for this box (put an empty string if you don't use angular)
        ngController: 'programmeTvCtrl as vm',
        file : 'box.ejs',
        icon: 'fa fa-download',
        type: 'box-primary'
    }],
 
    // link assets to project
    linkAssets: true
};