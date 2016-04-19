alt.loader.popup = function(){
    if(typeof alt.modules.popup !== 'undefined')
        return;

    alt.modules.popup = angular.module('alt-popup', [])
        .factory('$popup', ['$log', '$rootScope', '$button', '$q', function ($log, $rootScope, $button, $q) {
            var popup = {
                deferred: null,
                alert: function (config) {
                    if(typeof config === 'string')
                        config = {
                            title: config,
                            buttons: [
                                $button('close', {
                                    onclick: function(){
                                        popup.close(true);
                                    }
                                })
                            ]
                        };

                    return this.show('alert', config);
                },
                confirm: function (config) {
                    if(typeof config === 'string')
                        config = {
                            title: config,
                            buttons: [
                                $button('yes', {
                                    onclick: function(){
                                        popup.close(true);
                                    }
                                }),
                                $button('no', {
                                    onclick: function(){
                                        popup.close(false);
                                    }
                                })
                            ]
                        };

                    return this.show('confirm', config);
                },
                prompt: function (config) {
                    if(typeof config === 'string')
                        config = {
                            title: config,
                            buttons: [
                                $button('save', {
                                    onclick: function(){
                                        popup.close(true);
                                    }
                                }),
                                $button('cancel', {
                                    onclick: function(){
                                        popup.close(false);
                                    }
                                })
                            ]
                        };

                    return this.show('prompt', config);
                },

                show: function (type, config) {
                    this.deferred = $q.defer();

                    angular.forEach(config, function (val, key) {
                        $rootScope.$popup[key] = val;
                    });
                    $rootScope.$popup.type = true;
                    $rootScope.$popup.isshow = true;
                    $rootScope.$popup.showinput = type == 'prompt';

                    return this.deferred.promise;
                },
                close: function (status, data) {
                    $rootScope.$popup.isshow = false;
                    $rootScope.$popup.response.status = status;
                    $rootScope.$popup.response.data = data || $rootScope.$popup.response.data;

                    this.deferred[status ? 'resolve' : 'reject']($rootScope.$popup.response);
                }
            };

            return popup;
        }])
        .run(['$log', '$timeout', '$rootScope', function ($log, $timeout, $rootScope) {
            $rootScope.$popup = {};
        }]);

    alt.module('alt-popup', alt.modules.popup);
};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.popup();
    });
}else{
    alt.loader.popup();
}