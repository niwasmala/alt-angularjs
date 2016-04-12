alt.loader.secure = function(){
    if(typeof alt.modules.secure !== 'undefined')
        return alt.modules.secure;

    alt.modules.secure = angular.module('alt-secure', [])
        .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {
            $provide.factory('secureRequestHttpInterceptor', ['$log', '$q', '$window', function ($log, $q, $window) {
                var secureRequestHttpInterceptor = {
                    request: function (config) {
                        if (config.data && alt.environment == 'production' && config.method == "POST" && config.url.indexOf(alt.serverUrl) === 0 && config.headers["Content-Type"] == "application/x-www-form-urlencoded" && config.url.indexOf("auth/secure") == -1 && typeof alt.secure !== 'undefined' && typeof alt.secure.key !== 'undefined' && typeof alt.secure.iv !== 'undefined') {
                            var mode = alt.secure.key.length == 16;

                            var key = CryptoJS.enc[mode ? 'Utf8' : 'Base64'].parse(alt.secure.key);
                            var iv = CryptoJS.enc.Base64.parse(alt.secure.iv);
                            var encrypted = CryptoJS.AES.encrypt(
                                config.data,
                                key,
                                mode ? { padding: CryptoJS.pad.Pkcs7, iv: iv} : { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv});

                            config.data = encrypted.toString();
                        }
                        return config;
                    }
                };

                return secureRequestHttpInterceptor;
            }]);

            $httpProvider.interceptors.push('secureRequestHttpInterceptor');

            $provide.factory('secureResponseHttpInterceptor', ['$log', '$q', '$window', function ($log, $q, $window) {
                var secureResponseHttpInterceptor = {
                    response: function (response) {
                        if (alt.environment == 'production' && response.config.method == "POST" && response.config.url.indexOf(alt.serverUrl) === 0 && response.config.headers["Content-Type"] == "application/x-www-form-urlencoded" && response.config.url.indexOf("auth/secure") == -1 && typeof alt.secure !== 'undefined' && typeof alt.secure.key !== 'undefined' && typeof alt.secure.iv !== 'undefined') {
                            try{
                                var mode = alt.secure.key.length == 16;

                                var encrypted = (response.data + '');
                                var key = CryptoJS.enc[mode ? 'Utf8' : 'Base64'].parse(alt.secure.key + '');
                                var iv = CryptoJS.enc.Base64.parse(alt.secure.iv + '');
                                var decrypt = CryptoJS.AES.decrypt(encrypted, key, mode ? { iv: iv, padding: CryptoJS.pad.Pkcs7 } : { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
                                var decrypted = mode ? CryptoJS.enc.Utf8.stringify(decrypt) : (decrypt ? decrypt.toString(CryptoJS.enc.Utf8) : "");
                                if(mode) {
                                    var data = "";
                                    for (var i = 0; i < decrypted.length; i++) {
                                        if (btoa(decrypted[i]) != "AA==") data += decrypted[i];
                                    }
                                    decrypted = data;
                                }
                            }catch(e){
                                throw new Error("Tidak dapat melakukan parsing response dari server");
                            }

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