alt.loader.auth = function(){
    if(typeof alt.modules.auth !== 'undefined')
        return alt.modules.auth;

    alt.auth = {
        isenabled: true
    };
    alt.modules.auth = angular.module('alt-auth', ['angular-jwt'])
        .factory('$auth', ['$log', '$window', '$store', 'jwtHelper', function ($log, $window, $store, jwtHelper) {
            // set default local data
            $store.set('token', $store.get('token') || '');
            $store.set('userdata', $store.get('userdata') || {});

            return {
                token: '',
                userdata: {},
                set_token: function (token) {
                    this.token = token;
                    $store.set('token', this.token);
                },
                set_userdata: function (userdata) {
                    this.userdata = userdata;
                    $store.set('userdata', this.userdata);
                },
                login: function (data) {
                    // data can be a string token or object userdata
                    if (typeof data === 'string') {
                        // token
                        this.set_token(data);
                        this.set_userdata(jwtHelper.decodeToken(this.token));
                    } else {
                        this.set_userdata(data);
                    }
                },
                logout: function () {
                    this.token = '';
                    this.userdata = {};
                    $store.set('token', '');
                    $store.set('userdata', {});
                    $store.set('filter', '');
                    $store.set('sorting', '');
                },
                islogin: function () {
                    return this.token != '' ? !jwtHelper.isTokenExpired(this.token) : Object.keys(this.userdata).length > 0;
                },
                check: function (permission, level) {
                    level = level || this.userdata.userlevel;

                    return permission == 0 ? this.islogin() : this.islogin() && typeof level !== 'undefined' && ((parseInt(level) & parseInt(permission)) > 0);
                },
                set_permission: function (permission, level, redirect) {
                    level = level || this.userdata.userlevel;

                    redirect = typeof redirect !== 'undefined' ? redirect : true;
                    if (!this.check(permission, level)) {
                        if (redirect) {
                            $window.location.href = alt.baseUrl + 'error?code=403';
                        }
                        return false;
                    }
                    return true;
                }
            };
        }])
        .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {
            $provide.factory('authHttpInterceptor', ['$auth', '$log', '$q', '$window', function ($auth, $log, $q, $window) {
                return {
                    request: function (config) {
                        if(!alt.auth.isenabled) return config;
                        if ($auth.token) config.headers['Authorization'] = 'Bearer ' + $auth.token;
                        
                        return config;
                    }
                };
            }]);

            $httpProvider.interceptors.reverse().push('authHttpInterceptor');
            $httpProvider.interceptors.reverse();
        }])
        .run(['$rootScope', '$auth', '$log', '$store', function ($rootScope, $auth, $log, $store) {
            $rootScope.$auth = $auth;

            if($store.get('token') != '')
                $auth.login($store.get('token'));
            if($store.get('userdata') != '')
                $auth.login($store.get('userdata'));
        }]);

    alt.module('alt-auth', alt.modules.auth);
};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.auth();
    });
}else{
    alt.loader.auth();
}