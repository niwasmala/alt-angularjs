alt.loader.loading = function(){
    if(typeof alt.modules.loading !== 'undefined')
        return;

    alt.modules.loading = angular.module('alt-loading', [])
        .factory('$loading', ['$log', '$rootScope', function($log, $rootScope) {
            return {
                show: function(){
                    $rootScope.$loading.counter++;
                    $rootScope.$loading.isshow = $rootScope.$loading.counter > 0;
                },
                close: function(){
                    $rootScope.$loading.counter--;
                    $rootScope.$loading.isshow = $rootScope.$loading.counter > 0;
                }
            };
        }])
        .run(['$log', '$timeout', '$rootScope', '$loading', function($log, $timeout, $rootScope, $loading){
            $rootScope.$loading = {};
        }]);

    alt.module('alt-loading', alt.modules.loading);
};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.loading();
    });
}else{
    alt.loader.loading();
}