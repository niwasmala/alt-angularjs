var alt = angular.module('Alt', ['ngRoute', 'angular-jwt']);

// environment
alt.application = 'alt';
alt.environment = 'production';
alt.version = '1.1.1';
alt.urlArgs = '';
alt.language = 'id';
alt.urlArgs = alt.environment == 'production' ? '_v=' + alt.version : '_t=' + (+new Date());
alt.dictionary = {};

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

// object registry
alt.registry = {};

// configuring angular module
alt.config([
    '$locationProvider', '$compileProvider', '$controllerProvider', '$filterProvider', '$logProvider', '$provide', '$routeProvider', '$httpProvider',
    function($locationProvider, $compileProvider, $controllerProvider, $filterProvider, $logProvider, $provide, $routeProvider, $httpProvider){
        // hashbang route
        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix('!');
        alt.baseUrl = '#!/';

        // whitelist for unsafe
        var whitelist = /^\s*(https?|ftp|mailto|file|tel|app):|data:image|javascript:|\//;
        if($compileProvider.urlSanitizationWhitelist)    $compileProvider.urlSanitizationWhitelist(whitelist);

        // configuring provider for loading after bootstrapped
        alt._controller = alt.controller;
        alt._service = alt.service;
        alt._factory = alt.factory;
        alt._value = alt.value;
        alt._directive = alt.directive;
        alt._filter = alt.filter;
        alt._run = alt.run;

        // enabling define controller/service/directive, etc after bootstrapped
        alt.controller = function(name, constructor) {
            $controllerProvider.register(name, constructor);
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

        // configure application routing, with default
        alt.routing = function(){
            return {
                template: '<div data-ng-controller="controller" data-ng-include="view"></div>',
                controller: null,
                resolve: {
                    load: [
                        '$q', '$route', '$timeout', '$auth', '$log', 'jwtHelper', '$api','$window', '$rootScope',
                        function ($q, $route, $timeout, $auth, $log, jwtHelper, $api, $window, $rootScope){
                            var onRouteChanged = $rootScope.onRouteChanged(),
                                deferred = $q.defer(),
                                routeParams = $route.current.params,
                                $scope = angular.element(document.getElementsByTagName('body')[0]).scope();

                            onRouteChanged.then(function(){
                                $scope.view = alt.routeFolder + '/' + (routeParams['altmodule'] ? routeParams['altmodule'] + '/' : '') + (routeParams['altcontroller'] ? routeParams['altcontroller'] + '/' : '') + (routeParams['altaction'] ? routeParams['altaction'] + '/' : '') + 'view.html' + (alt.urlArgs != '' ? '?' + alt.urlArgs : '');
                                require([
                                    alt.routeFolder + '/' + (routeParams['altmodule'] ? routeParams['altmodule'] + '/' : '') + (routeParams['altcontroller'] ? routeParams['altcontroller'] + '/' : '') + (routeParams['altaction'] ? routeParams['altaction'] + '/' : '') + 'controller' + (alt.environment == 'production' ? '.min' : '')
                                ], function (controller) {
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
        alt.menuFolder = alt.menuFolder || 'menu';
        alt.routeFolder = alt.routeFolder || 'route';
        alt.defaultRoute = alt.defaultRoute || '';
        $routeProvider.when('/', alt.defaultRoute != '' ? {redirectTo: alt.defaultRoute} : alt.routing());
        $routeProvider.when('/:altaction', alt.routing());
        $routeProvider.when('/:altcontroller/:altaction', alt.routing());
        $routeProvider.when('/:altmodule/:altcontroller/:altaction', alt.routing());
        $routeProvider.otherwise({
            resolve: {
                redirectCheck: ['$location', function ($location) {
                    if ($location.absUrl().indexOf('#!/') === -1) $location.path('/');
                }]
            }
        });

        // we will be using common request content-type, not using default application/json from angular
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        var transformRequest = null;

        $provide.factory('httpInterceptor', ['$log', '$q', '$window', '$auth', function($log, $q, $window, $auth){
            return {
                request: function(config){
                    transformRequest = transformRequest || config.transformRequest;

                    if(config.headers['Content-Type']){
                        // if send using form urlencoded
                        if(config.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') === 0){
                            var data = [],
                                transform = function(key, value){
                                    if(key == '$$hashKey') return '';

                                    switch(typeof value){
                                        case "string":
                                        case "number":
                                            return key + "=" + encodeURIComponent(value);
                                            break;
                                        case "object":
                                            var tmp = [];
                                            for(var i in value) if(value.hasOwnProperty(i)) if(i != '$$hashKey'){
                                                tmp.push(transform(key + "[" + i + "]", value[i]));
                                            }
                                            return tmp.join("&");
                                            break;
                                        case "array":
                                            var tmp = [];
                                            for(var i=0; i<value.length; i++){
                                                tmp.push(transform(key + "[" + i + "]", value[i]));
                                            }
                                            return tmp.join("&");
                                            break;
                                        default:
                                            break;
                                    }
                                };

                            if(config.url.indexOf(alt.serverUrl) === 0) data.push(transform("token", $auth.token));
                            for(var key in config.data) if(config.data.hasOwnProperty(key)){
                                if(key != '$$hashKey') data.push(transform(key, config.data[key]));
                            }

                            config.transformRequest = transformRequest;
                            config.data = data.join("&");
                        }else if(config.headers['Content-Type'].indexOf('multipart/form-data') == 0){
                            config.transformRequest = [function(data){
                                var fd = new FormData(),
                                    transform = function(fd, key, value){
                                        if(key == '$$hashKey') return '';

                                        switch(typeof value){
                                            case "string":
                                            case "number":
                                                fd.append(key, value);
                                                break;
                                            case "object":
                                                if(typeof File !== 'undefined' && value instanceof File){
                                                    fd.append(key, value);
                                                }else if(typeof File === 'undefined' && typeof value.name !== 'undefined') {
                                                    fd.append(key, value);
                                                }else{
                                                    for(var i in value) if(value.hasOwnProperty(i)) if(i != '$$hashKey'){
                                                        transform(fd, key + "[" + i + "]", value[i]);
                                                    }
                                                }
                                                break;
                                            case "array":
                                                for(var i=0; i<value.length; i++){
                                                    transform(fd, key + "[" + i + "]", value[i]);
                                                }
                                                break;
                                            default:
                                                break;
                                        }
                                    };

                                if(config.url.indexOf(alt.serverUrl) === 0) transform(fd, "token", $auth.token);
                                for(var key in config.data) if(config.data.hasOwnProperty(key)){
                                    if(key != '$$hashKey') transform(fd, key, config.data[key]);
                                }
                                return fd;
                            }];
                            delete config.headers['Content-Type'];
                        }
                    }

                    return config;
                },
                response: function(response){
                    var res = angular.copy(response);

                    if(typeof response.data === 'object'){
                        res.version = response.data.v || 100;
                        res.code = response.data.s || 0;
                        res.status = res.code;
                        res.data = response.data.d || '';
                        res.message = response.data.m || '';
                        res.time = response.data.t || 0;
                        res.usage = response.data.u || '';

                        if(res.status != 0){
                            if(res.status == '401'){
                                $window.location.href = alt.baseUrl + 'auth/login';
                                return $q.reject(res);
                            }
                            res.message = res.message || 'Gagal terhubung ke server';
                            return $q.reject(res);
                        }
                    }else if(response.config.url.indexOf(alt.serverUrl) === 0 && typeof response.data !== 'object'){
                        res.code = -1;
                        res.status = res.code;
                        res.message = 'Tidak dapat terhubung ke server';
                        if(alt.environment.toLowerCase() == 'development') res.message += '<br/>' + response.data;
                        return $q.reject(res);
                    }

                    return res;
                }
            };
        }]);

        $httpProvider.interceptors.push('httpInterceptor');
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


// creating api service for connecting to server
alt.factory('$api', ['$http', '$log', function($http, $log){
    return function(url, pkey){
        url = url || '';
        var tmp = url.split('/');
        pkey = pkey || (tmp[tmp.length-1] + 'id');
        url = (url.indexOf(alt.serverUrl) !== 0 ? alt.serverUrl : '') + url;
        return {
            url: url,
            pkey: pkey,
            connect: function(url2, data, setting){
                url2 = url2 || '';
                url2 = (url2.indexOf('/') !== 0 ? '/' : '') + url2;
                data = data || {};
                setting = alt.extend({
                    skipAuthorization: false,
                    ismultipart: false
                }, setting);
                return $http({
                    headers: {
                        'Content-Type': setting.ismultipart ? 'multipart/form-data' : 'application/x-www-form-urlencoded'
                    },
                    skipAuthorization: setting.skipAuthorization,
                    method: 'POST',
                    data: data,
                    url: url + url2
                });
            },
            count: function(data, setting){
                return this.connect('count', data, setting);
            },
            list: function(data, setting){
                return this.connect('list', data, setting);
            },
            retrieve: function(id, data, setting){
                id = id || '';
                data = data || {};
                data[pkey] = id;
                return this.connect('retrieve', data, setting);
            },
            keyvalues: function(data, setting){
                return this.connect('keyvalues', data, setting);
            },
            insert: function(data, setting){
                return this.connect('insert', data, setting);
            },
            update: function(data, setting){
                return this.connect('update', data, setting);
            },
            remove: function(id, setting){
                id = id || '';
                var data = {};
                data[pkey] = id;
                return this.connect('delete', data, setting);
            },
            isexist: function(data, setting){
                return this.connect('is_exist', data, setting);
            }
        }
    };
}]);

// local storage service
alt.factory('$storage', ['$log', '$q', function($log, $q){
    // set default local data
    store.set(alt.application + '_data', store.get(alt.application + '_data') || {});

    return function(table, pk){
        pk = pk || table + 'id';

        return {
            table: table,
            pk: pk,
            list: function(){
                var data = store.get(alt.application + '_data');
                var res = data[table] || [];

                var deferred = $q.defer();
                deferred.resolve(res);
                return deferred.promise;
            },
            save: function(data){
                var alldata = store.get(alt.application + '_data');
                alldata[table] = data;
                store.set(alt.application + '_data', alldata);

                var deferred = $q.defer();
                deferred.resolve(1);
                return deferred.promise;
            },
            search: function(key, value){
                var data = this.list(table);
                var isfound = false;
                var res = {
                    id: -1,
                    data: null
                };

                for(var i=0; i<data.length; i++){
                    isfound = isfound || data[i][key] == value;
                    if(isfound){
                        res.id = i;
                        res.data = data[i];
                        break;
                    }
                }

                var deferred = $q.defer();
                deferred.resolve(res);
                return deferred.promise;
            },
            count: function(){
                var data = this.list(table);
                var res = data.length;

                var deferred = $q.defer();
                deferred.resolve(res);
                return deferred.promise;
            },
            insert: function(row){
                var data = this.list(table);
                row[pk] = parseInt(data[data.length-1] ? data[data.length-1][pk] || 0 : 0) + 1;
                data.push(row);
                return this.save(data);
            },
            retrieve: function(index){
                var row = this.search(pk, index),
                    res = row.data;

                var deferred = $q.defer();
                deferred.resolve(res);
                return deferred.promise;
            },
            update: function(newdata){
                var data = this.list(table);
                var row = this.search(pk, newdata[pk]);
                data[row.id] = newdata;
                return this.save(data);
            },
            remove: function(id){
                var all = this.list(),
                    data = this.search(pk, id);

                if(data.id == -1){
                    var deferred = $q.defer();
                    deferred.reject(res);
                    return deferred.promise;
                }else{
                    all.splice(data.id, 1);
                    return this.save(all);
                }
            },
            keyvalues: function(key, value){
                value = value || '';

                var data = this.list(table);
                var res = {};
                for(var i=0; i<data.length; i++){
                    res[data[i][key]] = value != '' ? data[i][value] : data[i];
                }

                var deferred = $q.defer();
                deferred.resolve(res);
                return deferred.promise;
            },
            isexist: function(key, value){
                var data = this.list();
                var res = 0;

                for(var i=0; i<data.length; i++){
                    res += data[i][key] == value ? 1 : 0;
                }

                var deferred = $q.defer();
                deferred.resolve(res);
                return deferred.promise;
            }
        };
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

// create auth service
alt.factory('$auth', ['$log', '$window', 'jwtHelper', function($log, $window, jwtHelper){
    // set default local data
    store.set(alt.application + '_token', store.get(alt.application + '_token') || '');
    store.set(alt.application + '_userdata', store.get(alt.application + '_userdata') || {});

    return {
        token: '',
        userdata: {},
        login: function(data){
            // data can be a string token or object userdata
            if(typeof data === 'string'){
                // token
                this.token = data;
                this.userdata = jwtHelper.decodeToken(this.token);
            }else{
                this.token = '';
                this.userdata = data;
            }

            store.set(alt.application + '_token', this.token);
            store.set(alt.application + '_userdata', this.userdata);
        },
        logout: function(){
            this.token = '';
            this.userdata = {};
            store.set(alt.application + '_token', '');
            store.set(alt.application + '_userdata', {});
            store.set(alt.application + '_filter', '');
            store.set(alt.application + '_sorting', '');
        },
        islogin: function(){
            return this.token != '' ? !jwtHelper.isTokenExpired(this.token) : Object.keys(this.userdata).length > 0;
        },
        check: function(level){
            return level == 0 ? this.islogin() : this.islogin() && typeof this.userdata.userlevel !== 'undefined' && ((parseInt(this.userdata.userlevel) & parseInt(level)) > 0);
        },
        set_permission: function(level, redirect){
            redirect = typeof redirect !== 'undefined' ? redirect : true;
            if(!this.check(level)){
                if(redirect){
                    $window.location.href = alt.baseUrl + 'error?code=403';
                }
                return false;
            }
            return true;
        }
    };
}]);

// create export service
alt.factory('$export', ['$log', function($log){
    return {
        excel: function(html, filename){
            filename = filename || 'download';

            // replacing ngtable filter
            html = html + '';

            var uri         = 'data:application/vnd.ms-excel;base64,',
                template    = '';

            template       += '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:Name>' + filename + '</x:Name><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>' + filename + '</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
            template       += html;
            template       += "</body></html>";

            window.open(uri + window.btoa(template), '_blank');
        },
        print: function(html, css){
            html = html || '';
            css = css || '<link type="text/css" rel="stylesheet" media="all" href="asset/css/bootstrap.min.css"/><link type="text/css" rel="stylesheet" media="all" href="asset/css/bootstrap-responsive.min.css"/><link type="text/css" rel="stylesheet" media="all" href="asset/css/style.min.css"/>';
            var win = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
            win.document.write(css);
            win.document.write(html);
            win.document.close();
            win.focus();
            win.print();
            win.close();
        }
    };
}]);

// create validate factory
alt.factory('$valid', ['$log', function($log){
    return {
        required: function(field){
            if(field !== 0)
                field = (field || '') + '';
            return field !== '' && typeof field !== 'undefined';
        },
        regex: function(field, regex){
            field = (field || '') + '';
            return regex.test(field);
        },
        email: function(email){
            return this.regex(email, /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
        },
        username: function(username){
            username = username + '';
            return username.toLowerCase().replace(/[^a-z0-9._-]/,'');
        },
        number: function(number){
            return this.regex(number, /^[0-9]+\.?[0-9]*?$/i);
        },
        integer: function(integer){
            return this.regex(integer, /^[0-9]*$/i);
        },
        equals: function(field1, field2){
            return field1 === field2;
        },
        notequals: function(field1, field2){
            return field1 !== field2;
        },
        lessthan: function(left, right){
            return left < right;
        },
        lessequalthan: function(left, right){
            return left <= right;
        },
        greaterthan: function(left, right){
            return left > right;
        },
        greaterequalthan: function(left, right){
            return left <= right;
        },
        between: function(number, min, max){
            return min <= number && number <= max;
        },
        date: function(field){
            field = field + '';
            return field.length == 8 && moment(field, 'YYYYMMDD').isValid();
        },
        month: function(field){
            field = field + '';
            return field.length == 6 && moment(field, 'YYYYMM').isValid();
        },
        year: function(field){
            field = field + '';
            return field.length == 4 && moment(field, 'YYYY').isValid();
        },
        time: function(field){
            field = field + '';
            return field.length == 4 && moment(field, 'HHmm').isValid();
        }
    };
}]);

// create validation service
alt.factory('$validate', ['$valid', '$log', '$injector', function($valid, $log, $injector){
    var validation = function(){
        return {
            rules: [],
            messages: [],
            rule: function(rule, message){
                this.rules.push(rule);
                this.messages.push(message);
                return this;
            },
            validate: function(){
                var res = true,
                    message = [];

                for(var i=0; i<this.rules.length; i++) if(!this.rules[i]){
                    res = false;
                    message.push(this.messages[i]);
                }

                return {
                    res: res,
                    message: message
                }
            },
            check: function(){
                var validation = this.validate(),
                    $alert = $injector.get('$alert');
                if(!validation.res && $alert){
                    $alert.add(validation.message.join("<br/>"), $alert.danger);
                }
                return validation.res;
            }
        };
    };
    for(var i in $valid) if($valid.hasOwnProperty(i)){
        validation[i] = $valid[i];
    }
    return validation;
}]);

// create i18n service
alt.factory('$i18n', ['$log', function($log){
    return function(str){
        return alt.dictionary[alt.language] ? (alt.dictionary[alt.language][str] || str) : str;
    };
}]);

// on running application
alt.run([
    '$rootScope', '$q', '$log', '$auth', '$api', '$validate',
    function($rootScope, $q, $log, $auth, $api, $validate){
        $rootScope.defaultRouteChanged  = function(){
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        };
        $rootScope.onRouteChanged       = $rootScope.defaultRouteChanged;

        var token = store.get(alt.application + '_token') || '';
        if(token != '') $auth.login(token);

        $rootScope.alt          = alt;
        $rootScope.store        = store;
        $rootScope.$validate    = $validate;
        $rootScope.$auth        = $auth;

        // menu
        $rootScope.menu = store.get(alt.application + '_menu') || {'submenu':''};
        $rootScope.$watch('menu', function(newvalue, oldvalue){
            if(newvalue != oldvalue){
                store.set(alt.application + '_menu', newvalue);
                $rootScope.menu = newvalue;
            }
        }, true);

        $rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
            alt.menu = alt.menuFolder + '/' + (currRoute.params.altaction == 'viewer' ? $auth.userdata.usergroupname : 'public') + '.html';
            $rootScope.menuLocation = alt.menu;
            $rootScope.isLoaded = false;
            $rootScope.menu.submenu = '';
        });

        $rootScope.$on('$routeChangeSuccess', function(event, currRoute, prevRoute){
            $rootScope.isLoaded = true;
        });
    }
]);

// set to global window object
window.alt = alt;