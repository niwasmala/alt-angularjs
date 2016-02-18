var alt = angular.module('Alt', []);

// environment
alt.application = 'alt';
alt.environment = 'production';
alt.version = '2.0.0';
alt.urlArgs = '';
alt.urlArgs = alt.environment == 'production' ? '_v=' + alt.version : '_t=' + (+new Date());
alt.theme = '';
alt.requires = [];
alt.componentFolder = 'component';

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

// calling component (controller and view) defined
alt.directive('altComponent', ['$log', function($log){
    return {
        templateUrl: function(element, attribute, transclude){
            var location = alt.componentFolder +'/' + attribute.altComponent + '/',
                view = location + 'view.' + (alt.theme != '' ? alt.theme + '.' : '') + 'html' + (alt.urlArgs != '' ? '?' + alt.urlArgs : '');

            return view;
        },
        transclude: true,
        scope: {
            altComponent: '@',
            scope: '=',
            onload: '&?'
        },
        controller: ['$scope', '$timeout', '$interval', '$attrs', '$element', function($scope, $timeout, $interval, $attrs, $element){
            // wait until $scope.scope is defined
            var load = function() {
                $scope.onload = $scope.onload || function(){ return angular.noop; };
                $scope.onload = $scope.onload();
                $scope.alt = alt;

                var location = alt.componentFolder +'/' + $scope.altComponent + '/',
                    $injector = angular.element(document.getElementsByTagName('body')[0]).injector();

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
                                case '$attrs':
                                    tmp = $attrs;
                                    break;
                                case '$element':
                                    tmp = $element;
                                    break;
                                default:
                                    tmp = $injector.get(controller[i]) || null;
                                    break;
                            }
                            args.push(tmp);
                        }
                        fn.apply(this, args);
                    }

                    // backup original scope value from controller
                    angular.forEach($scope, function(value, key){
                        if(key.substr(0, 1) !== '$' && key != 'scope' && key != 'altComponent' && key != 'onload') {
                            try{
                                $scope['_' + key] = angular.copy(value);
                            }catch(e){

                            }
                        }
                    });

                    // set component scope from outside
                    angular.forEach($scope.scope, function(value, key){
                        try{
                            $scope[key] = angular.copy(value);
                        }catch(e){

                        }
                    });

                    // set outside scope from component
                    var fillParent = function(scope){
                        if(scope.$parent == null) return;
                        if(typeof scope.$parent.$attrs === 'undefined' && typeof scope.$parent[$attrs.scope] === "object"){
                            scope.$parent[$attrs.scope] = $scope;
                        }
                        return fillParent(scope.$parent);
                    };
                    fillParent($scope);

                    // apply
                    $scope.$apply();

                    // call onload after all applied
                    $timeout(function(){
                        $scope.onload();
                    });
                });
            }, interval = function(){
                if(typeof $scope.scope !== 'undefined'){
                    window.clearInterval(id_interval);
                    load();
                }
            }, id_interval = window.setInterval(interval, 100);
        }]
    };
}]);

// calling component (controller and view) defined
alt.directive('altTransclude', ['$log', function($log){
    return {
        templateUrl: function(element, attribute, transclude){
            var location = alt.componentFolder +'/' + attribute.altTransclude + '/',
                view = location + 'view.' + (alt.theme != '' ? alt.theme + '.' : '') + 'html' + (alt.urlArgs != '' ? '?' + alt.urlArgs : '');

            return view;
        },
        transclude: true,
        scope: true,
        controller: ['$scope', '$timeout', '$interval', '$attrs', '$element', '$rootScope', function($scope, $timeout, $interval, $attrs, $element, $rootScope){
            $scope.$attrs = $attrs;

            var load = function() {
                var scope = $scope.$new(),
                    location = alt.componentFolder +'/' + $attrs.altTransclude + '/',
                    $injector = angular.element(document.getElementsByTagName('body')[0]).injector();

                scope.alt = alt;
                scope.altTransclude = $attrs.altTransclude;
                scope.scope = $attrs.scope;
                scope.onload = $scope[$attrs.onload] || angular.noop;
                scope.parent = $scope;

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
                                    tmp = scope;
                                    break;
                                case '$injector':
                                    tmp = $injector;
                                    break;
                                case '$attrs':
                                    tmp = $attrs;
                                    break;
                                case '$element':
                                    tmp = $element;
                                    break;
                                default:
                                    tmp = $injector.get(controller[i]) || null;
                                    break;
                            }
                            args.push(tmp);
                        }
                        fn.apply(this, args);
                    }

                    // backup original scope value from controller
                    angular.forEach(scope, function(value, key){
                        if(key.substr(0, 1) !== '$' && key != 'scope' && key != 'altTransclude' && key != 'onload' && key != 'parent') {
                            try{
                                scope['_' + key] = angular.copy(value);
                            }catch(e){

                            }
                        }
                    });

                    // set component scope from outside
                    angular.forEach($scope[$attrs.scope], function(value, key){
                        if(value != null && typeof value.$watch === 'undefined') {
                            try{
                                scope[key] = angular.copy(value);
                            }catch(e){

                            }
                        }
                    });

                    // apply
                    if($attrs.scope) $scope[$attrs.scope] = scope;
                    if($attrs.scope && $scope.$parent[$attrs.scope]) $scope.$parent[$attrs.scope] = scope;
                    scope.$apply();

                    // call onload after all applied
                    $timeout(function(){
                        scope.onload();
                    });
                });
            }, interval = function(){
                if(typeof $attrs.scope === "undefined" || typeof $scope[$attrs.scope] !== 'undefined'){
                    window.clearInterval(id_interval);
                    load();
                }
            }, id_interval = window.setInterval(interval, 100);
        }]
    };
}]);

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