alt.language = 'id';
alt.dictionary = alt.extend({id: {}}, alt.dictionary);

// create i18n service
alt.modules.i18n = angular.module('alt-i18n', [])
    .factory('$i18n', ['$log', function ($log) {
        return function (str) {
            return alt.dictionary[alt.language] ? (alt.dictionary[alt.language][str] || str) : str;
        };
    }]);

alt.module('alt-i18n', alt.modules.i18n);