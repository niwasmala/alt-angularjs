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
                    //template: '<div id="templateView" data-ng-controller="controller" data-ng-include="view"></div>',
                    templateUrl: function($routeParams){
                        var location = alt.routeFolder +'/' + ($routeParams['altmodule'] ? $routeParams['altmodule'] + '/' : '') + ($routeParams['altcontroller'] ? $routeParams['altcontroller'] + '/' : '') + ($routeParams['altaction'] ? $routeParams['altaction'] + '/' : ''),
                            view = location + 'view.' + (alt.theme != '' ? alt.theme + '.' : '') + 'html' + (alt.urlArgs != '' ? '?' + alt.urlArgs : '');

                        return view;
                    },
                    controller: ['$scope', '$log', '$routeParams', '$rootScope', '$q', function($scope, $log, $routeParams, $rootScope, $q){
                        var onRouteChanged = $rootScope.onRouteChanged($routeParams) || function(){
                                    var deferred = $q.defer();
                                    deferred.resolve();
                                    return deferred.promise;
                                },
                            location = alt.routeFolder +'/' + ($routeParams['altmodule'] ? $routeParams['altmodule'] + '/' : '') + ($routeParams['altcontroller'] ? $routeParams['altcontroller'] + '/' : '') + ($routeParams['altaction'] ? $routeParams['altaction'] + '/' : ''),
                            $injector = angular.element(document.getElementsByTagName('body')[0]).injector();

                        onRouteChanged.then(function(){
                            requirejs([
                                location + 'controller'
                            ], function (controller) {
                                var i = 0,
                                    args = [];
                                if(typeof controller === "function"){
                                    for(i=0; i<arguments.length; i++) args.push(arguments[i]);
                                    args.push($injector);
                                    controller.apply(this, args);
                                }else if(typeof controller === "object" && controller.length){
                                    var fn = typeof controller[controller.length-1] == 'function' ? controller[controller.length-1] : angular.noop,
                                        len = typeof controller[controller.length-1] == 'function' ? controller.length - 1 : controller.length,
                                        tmp;

                                    for(i=0; i<len; i++){
                                        tmp = null;
                                        switch(controller[i]){
                                            case '$scope':
                                                tmp = $scope;
                                                break;
                                            case '$injector':
                                                tmp = $injector;
                                                break;
                                            default:
                                                tmp = $injector.get(controller[i]) || null;
                                                break;
                                        }
                                        args.push(tmp);
                                    }
                                    fn.apply(this, args);
                                }

                                // apply all changes
                                $scope.$apply();

                                // emit that route has been loaded
                                $rootScope.$emit('$routeChangeLoaded');
                            });
                        });
                    }]
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