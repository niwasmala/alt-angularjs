// configuration files
alt.application = 'alt';
alt.version = '2.0.0';
alt.environment = 'production';
alt.urlArgs = alt.environment == 'production' ? '_v=' + alt.version : '_t=' + (+new Date());
alt.useMinified = alt.environment == 'production';
alt.serverUrl = 'server/';
alt.defaultRoute = 'auth/login';

// advanced configuration
alt.run(['$log', '$rootScope', '$auth', '$alert', '$api', '$window', function($log, $rootScope, $auth, $alert, $api, $window){
    $rootScope.notification = {
        reminder: {
            show: false,
            count: 0
        },
        todo: {
            show: false,
            count: 0
        }
    };
}]);