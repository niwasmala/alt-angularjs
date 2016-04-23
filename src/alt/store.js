alt.loader.store = function(){
    if(typeof alt.modules.store !== 'undefined')
        return alt.modules.store;

    alt.modules.store = angular.module('alt-store', ['angular-storage', 'ngCookies'])
        .factory('$store', ['$log', 'store', function ($log, store) {
            return store.getNamespacedStore(alt.application);
        }])
        .run(['$rootScope', '$store', function($rootScope, $store){
            $rootScope.$store = $store;
        }]);

    alt.module('alt-store', alt.modules.store);
};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.store();
    });
}else{
    alt.loader.store();
}