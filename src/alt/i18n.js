alt.loader.i18n = function(){
    if(typeof alt.modules.i18n !== 'undefined')
        return alt.modules.i18n;

    alt.language = 'id';
    alt.dictionary = alt.extend({id: {}}, alt.dictionary);

    // create i18n service
    alt.modules.i18n = angular.module('alt-i18n', [])
        .run(['$rootScope', '$i18n', function($rootScope, $i18n){
            $rootScope.$i18n = $i18n;
        }])
        .factory('$i18n', ['$log', function ($log) {
            return function (str) {
                return alt.dictionary[alt.language] ? (alt.dictionary[alt.language][str] || str) : str;
            };
        }]);

    alt.module('alt-i18n', alt.modules.i18n);
};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.i18n();
    });
}else{
    alt.loader.i18n();
}