alt.modules.alert = angular.module('alt-alert', [])
    .factory('$alert', ['$log', '$timeout', '$rootScope', function($log, $timeout, $rootScope){
        return {
            items: [],
            warning: 'warning',
            danger: 'danger',
            info: 'info',
            success: 'success',
            ismultiple: true,
            add: function(message, type, skip){
                message = message || '';
                type = type || this.warning;
                skip = skip || 0;

                if(!this.ismultiple)
                    this.items = [];

                var self = this,
                    i = this.items.length,
                    item = {
                        type: type,
                        message: message,
                        skip: skip,
                        isshow: skip == 0,
                        onload: function(){
                            item.scope = this;
                            this.show();
                        }
                    };

                this.items.push(item);
            },
            check: function(){
                // TODO
            }
        };
    }])
    .run(['$log', '$timeout', '$rootScope', '$alert', function($log, $timeout, $rootScope, $alert){
        $rootScope.$alert = $alert;

        $rootScope.$on('$routeChangeLoaded', function(){
            $alert.check();
        })
    }]);

alt.module('alt-alert', alt.modules.alert);