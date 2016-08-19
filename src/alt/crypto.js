alt.loader.crypto = function(){
    if(typeof alt.modules.crypto !== 'undefined')
        return alt.modules.crypto;

    alt.modules.crypto = angular.module('alt-crypto', [])
        .factory('$crypto', ['$log', '$timeout', '$rootScope', function($log, $timeout, $rootScope){
            return {
                encrypt: function(data, key, iv){
                    var enc_key = CryptoJS.enc.Utf8.parse(key + '');
                    var enc_iv = CryptoJS.enc.Utf8.parse(iv + '');

                    var encrypted = CryptoJS.AES.encrypt(
                        data,
                        enc_key,
                        {
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7,
                            iv: enc_iv
                        });

                    return encrypted.ciphertext.toString();
                },
                decrypt: function(data, key, iv){
                    var decrypted = '';
                    try{
                        var encrypted = CryptoJS.enc.Hex.parse(data + '');
                        var enc_key = CryptoJS.enc.Utf8.parse(key + '');
                        var enc_iv = CryptoJS.enc.Utf8.parse(iv + '');
                        var decrypt = CryptoJS.AES.decrypt({
                                ciphertext: encrypted
                            }, enc_key, {
                                mode: CryptoJS.mode.CBC,
                                padding: CryptoJS.pad.Pkcs7,
                                iv: enc_iv
                            });

                        decrypted = decrypt.toString(CryptoJS.enc.Utf8);
                    }catch(e){
                        throw e;
                    }

                    return decrypted;
                }
            };
        }])
        .run(['$log', '$timeout', '$rootScope', '$crypto', function($log, $timeout, $rootScope, $crypto){
            $rootScope.$crypto = $crypto;
        }]);

    alt.module('alt-crypto', alt.modules.crypto);

};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.crypto();
    });
}else{
    alt.loader.crypto();
}