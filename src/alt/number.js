alt.loader.number = function(){
    if(typeof alt.modules.number !== 'undefined')
        return alt.modules.number;

    alt.modules.number = angular.module('alt-format', [])
        .factory('$number', ['$log', '$timeout', '$rootScope', function($log, $timeout, $rootScope){
            return {
                format: function(num, decimals, thousandSeparator, decimalSeparator){
                    num = num || 0;
                    decimals = decimals || 0;
                    thousandSeparator = thousandSeparator || '.';
                    decimalSeparator = decimalSeparator || ',';

                    return accounting.formatNumber(num, decimals, thousandSeparator, decimalSeparator);
                },
                unformat: function(num, decimalSeparator){
                    num = num || 0;
                    decimalSeparator = decimalSeparator || ',';

                    return accounting.unformat(num, decimalSeparator);
                }
            };
        }])
        .run(['$log', '$timeout', '$rootScope', '$number', function($log, $timeout, $rootScope, $number){
            $rootScope.$number = $number;
        }]);

    alt.module('alt-format', alt.modules.number);

};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.number();
    });
}else{
    alt.loader.number();
}