alt.loader.notification = function(){
    if(typeof alt.modules.notification !== 'undefined')
        return;

    alt.modules.notification = angular.module('alt-notification', [])
        .factory('$notification', ['$log', '$rootScope', function ($log, $rootScope) {
            return {
                get: function(){
                    if ($rootScope.$notification.isloading != null && $rootScope.$notification.isloading.abort)
                        $rootScope.$notification.isloading.abort();

                    $rootScope.$notification.count = 0;
                    $rootScope.$notification.notif = {};
                    $rootScope.$notification.isloading = $rootScope.$notification.get();
                }
            };
        }])
        .run(['$log', '$notification', '$rootScope', function ($log, $notification, $rootScope) {
            $rootScope.$notification = {
                count: 0,
                notif: {},
                isloading: null,
                get: angular.noop
            };

            $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
                $rootScope.$notification.get();
            });
        }]);

    alt.module('alt-notification', alt.modules.notification);
};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.notification();
    });
}else{
    alt.loader.notification();
}