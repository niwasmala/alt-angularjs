alt.loader.secure=function(){return"undefined"!=typeof alt.modules.secure?alt.modules.secure:(alt.modules.secure=angular.module("alt-secure",[]).config(["$provide","$httpProvider",function(e,t){e.factory("secureRequestHttpInterceptor",["$log","$q","$window",function(e,t,r){var n={request:function(e){if(e.data&&"production"==alt.environment&&"POST"==e.method&&0===e.url.indexOf(alt.serverUrl)&&"application/x-www-form-urlencoded"==e.headers["Content-Type"]&&-1==e.url.indexOf("auth/secure")&&"undefined"!=typeof alt.secure&&"undefined"!=typeof alt.secure.key&&"undefined"!=typeof alt.secure.iv){var t=16==alt.secure.key.length,r=CryptoJS.enc[t?"Utf8":"Base64"].parse(alt.secure.key),n=CryptoJS.enc.Base64.parse(alt.secure.iv),a=CryptoJS.AES.encrypt(e.data,r,t?{padding:CryptoJS.pad.Pkcs7,iv:n}:{mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.Pkcs7,iv:n});e.data=a.toString()}return e}};return n}]),t.interceptors.push("secureRequestHttpInterceptor"),e.factory("secureResponseHttpInterceptor",["$log","$q","$window",function(e,t,r){var n={response:function(e){if("production"==alt.environment&&"POST"==e.config.method&&0===e.config.url.indexOf(alt.serverUrl)&&"application/x-www-form-urlencoded"==e.config.headers["Content-Type"]&&-1==e.config.url.indexOf("auth/secure")&&"undefined"!=typeof alt.secure&&"undefined"!=typeof alt.secure.key&&"undefined"!=typeof alt.secure.iv){try{var r=16==alt.secure.key.length,n=e.data+"",a=CryptoJS.enc[r?"Utf8":"Base64"].parse(alt.secure.key+""),o=CryptoJS.enc.Base64.parse(alt.secure.iv+""),s=CryptoJS.AES.decrypt(n,a,r?{iv:o,padding:CryptoJS.pad.Pkcs7}:{iv:o,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.Pkcs7}),d=r?CryptoJS.enc.Utf8.stringify(s):s?s.toString(CryptoJS.enc.Utf8):"";if(r){for(var u="",c=0;c<d.length;c++)"AA=="!=btoa(d[c])&&(u+=d[c]);d=u}}catch(i){throw new Error("Tidak dapat melakukan parsing response dari server")}try{var p=angular.fromJson(d);"undefined"==typeof p.s||"undefined"==typeof p.m&&"undefined"==typeof p.d?e.data=p:(e.status=p.s,e.message=p.m,e.data=p.d)}catch(i){e.data=d}if(200!=e.status)return e.message=e.data||e.message,t.reject(e)}return e},responseError:function(e){var r=n.response(e);return 200!=e.status?t.reject(r):r}};return n}]),t.interceptors.splice(1,0,"secureResponseHttpInterceptor")}]),void alt.module("alt-secure",alt.modules.secure))},"undefined"!=typeof define?define([],function(){alt.loader.secure()}):alt.loader.secure();