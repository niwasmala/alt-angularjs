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
                            this._hide();
                            self.items.splice(self.items.indexOf(this), 1);
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