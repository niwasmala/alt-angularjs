alt.loader.alert = function(){
    if(typeof alt.modules.alert !== 'undefined')
        return alt.modules.alert;

    alt.modules.alert = angular.module('alt-alert', [])
        .factory('$alert', ['$log', '$timeout', '$rootScope', function($log, $timeout, $rootScope){
            return {
                items: [],
                warning: 'warning',
                danger: 'danger',
                info: 'info',
                success: 'success',
                ismultiple: true,
                timer: 4000,
                add: function(message, type, skip){
                    message = message || '';
                    type = type || this.warning;
                    skip = skip || 0;

                    if(!this.ismultiple)
                        this.items = [];

                    var self = this,
                        i = this.items.length,
                        item = {
                            id: i,
                            type: type,
                            message: message,
                            skip: skip,
                            isshow: skip == 0,
                            hide: function(){
                                this.isshow = false;
                                var index = self.items.indexOf(this),
                                    items = [];

                                angular.forEach(self.items, function(val, key){
                                    if(key != index) items.push(val);
                                });
                                
                                self.items = items;
                            },
                            onload: function(){
                                var scope = this;
                                $timeout(function(){
                                    scope.hide();
                                }, self.timer);
                            }
                        };
                    this.items.push(item);
                }
            };
        }])
        .run(['$log', '$timeout', '$rootScope', '$alert', function($log, $timeout, $rootScope, $alert){
            $rootScope.$alert = $alert;
        }]);

    alt.module('alt-alert', alt.modules.alert);

};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.alert();
    });
}else{
    alt.loader.alert();
}