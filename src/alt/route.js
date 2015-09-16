// configuring route for Alt application
alt.baseUrl = '#!/';
alt.routeFolder = alt.routeFolder || 'route';
alt.defaultRoute = alt.defaultRoute || '';

alt.modules.route = angular.module('alt-route', ['ngRoute'])
    .config([
        '$locationProvider', '$compileProvider', '$routeProvider',
        function($locationProvider, $compileProvider, $routeProvider){
            // hashbang route
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('!');

            // whitelist for unsafe
            var whitelist = /^\s*(https?|ftp|mailto|file|tel|app):|data:image|javascript:|\//;
            if($compileProvider.urlSanitizationWhitelist)    $compileProvider.urlSanitizationWhitelist(whitelist);

            // configure application routing, with default
            alt.routing = function(){
                var controllers = {};

                return {
                    template: '<div id="templateView" data-ng-controller="controller" data-ng-include="view"></div>',
                    controller: null,
                    resolve: {
                        load: [
                            '$q', '$route', '$timeout', '$log', '$window', '$rootScope',
                            function ($q, $route, $timeout, $log, $window, $rootScope){
                                var onRouteChanged = $rootScope.onRouteChanged($route.current.params),
                                    deferred = $q.defer(),
                                    routeParams = $route.current.params,
                                    $scope = angular.element(document.getElementsByTagName('body')[0]).scope(),
                                    route = (routeParams['altmodule'] ? routeParams['altmodule'] + '/' : '') + (routeParams['altcontroller'] ? routeParams['altcontroller'] + '/' : '') + (routeParams['altaction'] ? routeParams['altaction'] + '/' : ''),
                                    fn = null;

                                delete $scope.controller;
                                delete $scope.view;
                                onRouteChanged.then(function(){
                                    $scope.view = alt.routeFolder + '/' + route + 'view.' + (alt.theme != '' ? alt.theme + '.' : '') + 'html' + (alt.urlArgs != '' ? '?' + alt.urlArgs : '');
                                    require([
                                        alt.routeFolder + '/' + route + 'controller'
                                    ], function (controller) {
                                        // replace controller function, dom is not loaded yet
                                        if(typeof controllers[route] === 'undefined'){
                                            controllers[route] = controller[controller.length-1];
                                            controller[controller.length-1] = function(){
                                                var self = this,
                                                    args = arguments,
                                                    $scope;

                                                for(var i=0; i<controller.length; i++) if(controller[i] == '$scope'){
                                                    $scope = arguments[i];
                                                    break;
                                                }

                                                var off = $scope.$on('$includeContentLoaded', function(event) {
                                                    controllers[route].apply(self, args);
                                                    off();
                                                });
                                            };
                                        }

                                        $scope.controller = controller;
                                        $scope.$apply(function() {
                                            deferred.resolve();
                                        });
                                    }, function (error) {
                                        deferred.reject(error);
                                    });
                                }, function(error){
                                    deferred.reject(error);
                                });

                                return deferred.promise;
                            }
                        ]
                    }
                };
            };

            $routeProvider.when('/', alt.defaultRoute != '' ? {redirectTo: alt.defaultRoute} : alt.routing());
            $routeProvider.when('/:altaction', alt.routing());
            $routeProvider.when('/:altcontroller/:altaction', alt.routing());
            $routeProvider.when('/:altmodule/:altcontroller/:altaction', alt.routing());
            $routeProvider.otherwise({
                resolve: {
                    redirectCheck: ['$location', function ($location) {
                        if ($location.absUrl().indexOf(alt.baseUrl) === -1) $location.path('/');
                    }]
                }
            });
        }
    ]);

alt.module('alt-route', alt.modules.route);