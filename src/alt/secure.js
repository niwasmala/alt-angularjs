alt.loader.secure = function(){
    if(typeof alt.modules.secure !== 'undefined')
        return alt.modules.secure;

    alt.modules.secure = angular.module('alt-secure', [])
        .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {
            $provide.factory('secureRequestHttpInterceptor', ['$log', '$q', '$window', '$crypto', function ($log, $q, $window, $crypto) {
                return {
                    request: function (config) {
                        if (config.data && alt.environment == 'production' && config.method == "POST" && config.url.indexOf(alt.serverUrl) === 0 && config.headers["Content-Type"] == "application/x-www-form-urlencoded" && config.url.indexOf("auth/secure") == -1 && typeof alt.secure !== 'undefined' && typeof alt.secure.key !== 'undefined' && typeof alt.secure.iv !== 'undefined') {
                            config.data = $crypto.encrypt(config.data, alt.secure.key, alt.secure.iv);
                        }
                        return config;
                    }
                };
            }]);

            $httpProvider.interceptors.push('secureRequestHttpInterceptor');

            $provide.factory('secureResponseHttpInterceptor', ['$log', '$q', '$crypto', function ($log, $q, $crypto) {
                var secureResponseHttpInterceptor = {
                    response: function (response) {
                        if (alt.environment == 'production' && response.config.method == "POST" && response.config.url.indexOf(alt.serverUrl) === 0 && response.config.headers["Content-Type"] == "application/x-www-form-urlencoded" && response.config.url.indexOf("auth/secure") == -1 && typeof alt.secure !== 'undefined' && typeof alt.secure.key !== 'undefined' && typeof alt.secure.iv !== 'undefined') {
                            var decrypted = $crypto.decrypt(response.data, alt.secure.key, alt.secure.iv);

                            try {
                                var res = angular.fromJson(decrypted);
                                if(typeof res.s !== 'undefined' && (typeof res.m !== 'undefined' || typeof res.d !== 'undefined')){
                                    response.status = res.s;
                                    response.message = res.m;
                                    response.data = res.d;
                                }else{
                                    response.data = res;
                                }
                            } catch (e) {
                                response.data = decrypted;
                            }

                            if (response.status != 200) {
                                response.message = response.data || response.message;
                                return $q.reject(response);
                            }
                        }
                        return response;
                    },
                    responseError: function (response) {
                        var res = secureResponseHttpInterceptor.response(response);

                        if (response.status != 200) {
                            return $q.reject(res);
                        }

                        return res;
                    }
                };

                return secureResponseHttpInterceptor;
            }]);

            $httpProvider.interceptors.splice(1, 0, 'secureResponseHttpInterceptor');
        }]);

    alt.module('alt-secure', alt.modules.secure);
};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.secure();
    });
}else{
    alt.loader.secure();
}