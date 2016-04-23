alt.loader.crypto = function(){
    if(typeof alt.modules.crypto !== 'undefined')
        return alt.modules.crypto;

    alt.modules.crypto = angular.module('alt-crypto', [])
        .factory('$crypto', ['$log', '$timeout', '$rootScope', function($log, $timeout, $rootScope){
            return {
                encrypt: function(data, key, iv){
                    var mode = key.length == 16;
                    var enc_key = CryptoJS.enc[mode ? 'Utf8' : 'Base64'].parse(key + '');
                    var enc_iv = CryptoJS.enc.Base64.parse(iv + '');
                    var encrypted = CryptoJS.AES.encrypt(
                        data,
                        enc_key,
                        mode ? { padding: CryptoJS.pad.Pkcs7, iv: enc_iv} : { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: enc_iv});

                    return encrypted.toString();
                },
                decrypt: function(data, key, iv){
                    var decrypted = '';
                    try{
                        var mode = key.length == 16;
                        var encrypted = (data + '');
                        var enc_key = CryptoJS.enc[mode ? 'Utf8' : 'Base64'].parse(key + '');
                        var enc_iv = CryptoJS.enc.Base64.parse(iv + '');
                        var decrypt = CryptoJS.AES.decrypt(encrypted, enc_key, mode ? { iv: enc_iv, padding: CryptoJS.pad.Pkcs7 } : { iv: enc_iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

                        decrypted = mode ? CryptoJS.enc.Utf8.stringify(decrypt) : (decrypt ? decrypt.toString(CryptoJS.enc.Utf8) : "");
                        if(mode) {
                            var tmp = "";
                            for (var i = 0; i < decrypted.length; i++) {
                                if (btoa(decrypted[i]) != "AA==") tmp += decrypted[i];
                            }
                            decrypted = tmp;
                        }
                    }catch(e){
                        throw new Error("Tidak dapat melakukan parsing response dari server");
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