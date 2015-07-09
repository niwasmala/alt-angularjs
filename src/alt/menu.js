alt.menu = '';
alt.menuFolder = alt.menuFolder || 'menu';

alt.modules.menu = angular.module('alt-menu', [])
    .run(['$rootScope', function($rootScope){
        // menu
        $rootScope.menu = store.get(alt.application + '_menu') || {'submenu':''};
        $rootScope.$watch('menu', function(newvalue, oldvalue){
            if(newvalue != oldvalue){
                store.set(alt.application + '_menu', newvalue);
                $rootScope.menu = newvalue;
            }
        }, true);

        $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
            alt.menu = alt.menuFolder + '/' + (currRoute.params.altaction == 'viewer' ? $auth.userdata.usergroupname : 'public') + '.html';
            $rootScope.menuLocation = alt.menu;
            $rootScope.menu.submenu = '';
        });
    }]);

alt.module('alt-menu', alt.modules.menu);