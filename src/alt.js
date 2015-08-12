var alt = angular.module('Alt', []);

// environment
alt.application = 'alt';
alt.environment = 'production';
alt.version = '2.0.0';
alt.urlArgs = '';
alt.urlArgs = alt.environment == 'production' ? '_v=' + alt.version : '_t=' + (+new Date());
alt.theme = '';

// alt modules installed
alt.modules = {};

// object registry
alt.registry = {};

// extend function
alt.extend = function(src, dst){
    src = typeof src === 'undefined' || src == null ? {} : src;
    dst = typeof dst === 'undefined' || dst == null ? (Object.prototype.toString.call(src) === '[object Array]' ? [] : {}) : dst;

    angular.forEach(src, function(value, key){
        value = typeof value === 'undefined' || value == null ? {} : value;
        switch(typeof value){
            case "object":
                dst[key] = Object.prototype.toString.call(value) === '[object Array]' ? (dst[key] || value) : alt.extend(src[key], dst[key]);
                break;
            default:
                dst[key] = typeof dst[key] !== 'undefined' && dst[key] != angular.noop ? dst[key] : value;
                break;
        }
    });
    return dst;
};

// configuring angular module
alt.config([
    '$locationProvider', '$compileProvider', '$controllerProvider', '$filterProvider', '$logProvider', '$provide',
    function($locationProvider, $compileProvider, $controllerProvider, $filterProvider, $logProvider, $provide){
        // configuring provider for loading after bootstrapped
        alt._controller = alt.controller;
        alt._service = alt.service;
        alt._factory = alt.factory;
        alt._value = alt.value;
        alt._directive = alt.directive;
        alt._filter = alt.filter;
        alt._run = alt.run;
        alt._config = alt.config;

        // enabling define controller/service/directive, etc after bootstrapped
        alt.controller = function(name, constructor) {
            $controllerProvider.register(name, constructor);
            return this;
        };

        alt.config = function(name, obj) {
            $provide.config(name, obj);
            return this;
        };

        alt.constant = function(name, obj) {
            $provide.constant(name, obj);
            return this;
        };

        alt.service = function(name, constructor) {
            $provide.service(name, constructor);
            return this;
        };

        alt.factory = function(name, factory) {
            $provide.factory( name, factory );
            return this;
        };

        alt.value = function(name, value){
            $provide.value(name, value);
            return this;
        };

        alt.directive = function(name, factory){
            $compileProvider.directive( name, factory );
            return this;
        };

        alt.filter = function(name, fn){
            $filterProvider.register(name, fn);
            return this;
        };

        alt.run = function(block){
            var injector = angular.element(document.getElementsByTagName('body')[0]).injector(),
                $log = injector.get('$log'),
                runArgs = block.slice(0, block.length - 1),
                runFn = block[block.length - 1];

            for(var k=0; k<block.length-1; k++){
                runArgs[k] = injector.get(runArgs[k]);
            }
            runFn.apply(null, runArgs);
            return this;
        };

        alt.providers = {
            $compileProvider: $compileProvider,
            $controllerProvider: $controllerProvider,
            $filterProvider: $filterProvider,
            $logProvider: $logProvider,
            $provide: $provide
        };
    }
]);

// registering new dependency angular module
alt.module = function(modulename, module){
    if(alt.requires.indexOf(modulename) <= -1){
        alt.requires.push(modulename);

        try {
            var moduleFn    = module || angular.module(modulename),
                invokeQueue = moduleFn._invokeQueue,
                runBlocks   = moduleFn._runBlocks;

            // apply invoke queue
            for (var i=0; i<invokeQueue.length; i++) {
                var invokeArgs = invokeQueue[i],
                    provider = alt.providers[invokeArgs[0]];

                provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
            }

            // apply run block
            for(var j=0; j<runBlocks.length; j++){
                var runBlock = runBlocks[j],
                    runArgs = runBlock.slice(0, runBlock.length - 1),
                    runFn = runBlock[runBlock.length - 1],
                    injector = angular.element(document.getElementsByTagName('body')[0]).injector();

                for(var k=0; k<runArgs.length; k++){
                    runArgs[k] = injector.get(runArgs[k]);
                }
                runFn.apply(null, runArgs);
            }
        } catch (e) {
            //if (e.message) e.message += ' from ' + module;
        }
    }

    // return self for chaining method
    return alt;
};

// creating component
alt.components = {};
alt.component = function(config){
    if(typeof config.name === 'undefined') throw Error('Component must have a name!');
    if(typeof alt.components[config.name] === 'undefined'){
        config.require = config.require == null ? null : (config.require || null);
        config.restrict = config.restrict == null ? null : (config.restrict || 'A');
        config.replace = config.replace == null ? null : (config.replace || false);
        config.priority = config.priority == null ? null : (config.priority || null);
        config.templateUrl = config.templateUrl == null ? null : (config.templateUrl || null);
        config.templateUrl = config.templateUrl == null ? null : (config.templateUrl + (config.templateUrl != '' && alt.urlArgs != '' ? '?' + alt.urlArgs : ''));
        config.template = config.template == null ? null : (config.template || null);
        config.transclude = config.transclude == null ? null : (typeof config.transclude !== 'undefined' ? config.transclude : true);
        config.scope = config.scope == null ? null : (typeof config.scope !== 'undefined' ? config.scope :  {});
        config.controller = config.controller == null ? null : (config.controller || null);
        config.compile = config.compile == null ? null : (config.compile || null);

        alt.components[config.name] = alt.directive(config.name, ['$log', '$parse', '$timeout', function($log, $parse, $timeout){
            return {
                require: config.require,
                restrict: config.restrict,
                replace: config.replace,
                priority: config.priority,
                templateUrl: config.templateUrl,
                template: config.template,
                transclude: config.transclude,
                scope: config.scope,
                controller: config.controller,
                compile: config.compile,
                link: function($scope, $element, $attrs, $controller){
                    $scope.$component = config.name;
                    $scope.$name = $attrs[config.name];
                    $scope.alt = alt;
                    var $injector = angular.element(document.getElementsByTagName('body')[0]).injector(),
                        i = 0,
                        args = [];
                    if(typeof config.link === "function"){
                        for(i=0; i<arguments.length; i++) args.push(arguments[i]);
                        args.push($injector);
                        config.link.apply(this, args);
                    }else if(typeof config.link === "object" && config.link.length){
                        var fn = typeof config.link[config.link.length-1] == 'function' ? config.link[config.link.length-1] : angular.noop,
                            len = typeof config.link[config.link.length-1] == 'function' ? config.link.length - 1 : config.link.length,
                            tmp;
                        for(i=0; i<len; i++){
                            tmp = null;
                            switch(config.link[i]){
                                case '$scope':
                                    tmp = $scope;
                                    break;
                                case '$element':
                                    tmp = $element;
                                    break;
                                case '$attrs':
                                    tmp = $attrs;
                                    break;
                                case '$controller':
                                    tmp = $controller;
                                    break;
                                case '$injector':
                                    tmp = $injector;
                                    break;
                                default:
                                    tmp = $injector.get(config.link[i]) || null;
                                    break;
                            }
                            args.push(tmp);
                        }
                        fn.apply(this, args);
                    }
                }
            };
        }]);
    }

    return alt.components[config.name];
};

// hook ng-include after ready
alt.component({
    name: 'onReady',
    require: 'ngInclude',
    restrict: 'A',
    scope: {
        onReady: '&'
    },
    link: ['$scope', '$log', '$element', '$attrs', '$rootScope', '$controller', function($scope, $log, $element, $attrs, $rootScope, $controller){
        if($attrs.onReady && $scope.onReady && (!$attrs.ngController || ($attrs.ngController && $rootScope.controller))) $scope.onReady();
    }]
});

// creating uuid generator service
alt.factory('$uuid', function() {
    return {
        create: function() {
            function _p8(s) {
                var p = (Math.random().toString(16)+"000000000").substr(2,8);
                return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        },

        empty: function() {
            return '00000000-0000-0000-0000-000000000000';
        }
    };
});

// on running application
alt.run([
    '$rootScope', '$q', '$log',
    function($rootScope, $q, $log){
        $rootScope.defaultRouteChanged  = function(){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        };
        $rootScope.onRouteChanged = $rootScope.defaultRouteChanged;

        $rootScope.alt = alt;
    }
]);

// set to global window object
window.alt = alt;