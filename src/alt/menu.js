alt.loader.menu = function(){
    if(typeof alt.modules.menu !== 'undefined')
        return alt.modules.menu;

    alt.menu = '';
    alt.menuFolder = alt.menuFolder || 'menu';

    alt.modules.menu = angular.module('alt-menu', [])
        .run(['$rootScope', '$store', function ($rootScope, $store) {
            // menu
            $rootScope.menu = $store.get('menu') || {'submenu': ''};
            $rootScope.$watch('menu', function (newvalue, oldvalue) {
                if (newvalue != oldvalue) {
                    $store.set('menu', newvalue);
                    $rootScope.menu = newvalue;
                }
            }, true);

            $rootScope.$on('$routeChangeStart', function (event, currRoute, prevRoute) {
                alt.menu = alt.menuFolder + '/' + (currRoute.params.altaction == 'viewer' ? $auth.userdata.usergroupname : 'public') + '.html';
                $rootScope.menuLocation = alt.menu;
                $rootScope.menu.submenu = '';
            });
        }]);

    alt.module('alt-menu', alt.modules.menu);
};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.menu();
    });
}else{
    alt.loader.menu();
}