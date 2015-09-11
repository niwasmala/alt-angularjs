var alt=angular.module("Alt",[]);alt.application="alt",alt.environment="production",alt.version="2.0.0",alt.urlArgs="",alt.urlArgs="production"==alt.environment?"_v="+alt.version:"_t="+ +new Date,alt.theme="",alt.requires=[],alt.modules={},alt.registry={},alt.extend=function(e,t){return e="undefined"==typeof e||null==e?{}:e,t="undefined"==typeof t||null==t?"[object Array]"===Object.prototype.toString.call(e)?[]:{}:t,angular.forEach(e,function(l,n){switch(l="undefined"==typeof l||null==l?{}:l,typeof l){case"object":t[n]="[object Array]"===Object.prototype.toString.call(l)?t[n]||l:alt.extend(e[n],t[n]);break;default:t[n]="undefined"!=typeof t[n]&&t[n]!=angular.noop?t[n]:l}}),t},alt.config(["$locationProvider","$compileProvider","$controllerProvider","$filterProvider","$logProvider","$provide",function(e,t,l,n,r,o){alt._controller=alt.controller,alt._service=alt.service,alt._factory=alt.factory,alt._value=alt.value,alt._directive=alt.directive,alt._filter=alt.filter,alt._run=alt.run,alt._config=alt.config,alt.controller=function(e,t){return l.register(e,t),this},alt.config=function(e,t){return o.config(e,t),this},alt.constant=function(e,t){return o.constant(e,t),this},alt.service=function(e,t){return o.service(e,t),this},alt.factory=function(e,t){return o.factory(e,t),this},alt.value=function(e,t){return o.value(e,t),this},alt.directive=function(e,l){return t.directive(e,l),this},alt.filter=function(e,t){return n.register(e,t),this},alt.run=function(e){for(var t=angular.element(document.getElementsByTagName("body")[0]).injector(),l=(t.get("$log"),e.slice(0,e.length-1)),n=e[e.length-1],r=0;r<e.length-1;r++)l[r]=t.get(l[r]);return n.apply(null,l),this},alt.providers={$compileProvider:t,$controllerProvider:l,$filterProvider:n,$logProvider:r,$provide:o}}]),alt.module=function(e,t){if(alt.requires.indexOf(e)<=-1){alt.requires.push(e);try{for(var l=t||angular.module(e),n=l._invokeQueue,r=l._runBlocks,o=0;o<n.length;o++){var a=n[o],i=alt.providers[a[0]];i[a[1]].apply(i,a[2])}for(var u=0;u<r.length;u++){for(var c=r[u],p=c.slice(0,c.length-1),s=c[c.length-1],f=angular.element(document.getElementsByTagName("body")[0]).injector(),d=0;d<p.length;d++)p[d]=f.get(p[d]);s.apply(null,p)}}catch(m){}}return alt},alt.components={},alt.component=function(e){if("undefined"==typeof e.name)throw Error("Component must have a name!");return"undefined"==typeof alt.components[e.name]&&(e.require=null==e.require?null:e.require||null,e.restrict=null==e.restrict?null:e.restrict||"A",e.replace=null==e.replace?null:e.replace||!1,e.priority=null==e.priority?null:e.priority||null,e.templateUrl=null==e.templateUrl?null:e.templateUrl||null,e.templateUrl=null==e.templateUrl?null:e.templateUrl+"view."+(""!=alt.theme?alt.theme+".":"")+"html"+(""!=e.templateUrl&&""!=alt.urlArgs?"?"+alt.urlArgs:""),e.template=null==e.template?null:e.template||null,e.transclude=null==e.transclude?null:"undefined"!=typeof e.transclude?e.transclude:!0,e.scope=null==e.scope?null:"undefined"!=typeof e.scope?e.scope:{},e.controller=null==e.controller?null:e.controller||null,e.compile=null==e.compile?null:e.compile||null,alt.components[e.name]=alt.directive(e.name,["$log","$parse","$timeout",function(t,l,n){return{require:e.require,restrict:e.restrict,replace:e.replace,priority:e.priority,templateUrl:e.templateUrl,template:e.template,transclude:e.transclude,scope:e.scope,controller:e.controller,compile:e.compile,link:function(t,l,n,r){t.$component=e.name,t.$name=n[e.name],t.alt=alt;var o=angular.element(document.getElementsByTagName("body")[0]).injector(),a=0,i=[];if("function"==typeof e.link){for(a=0;a<arguments.length;a++)i.push(arguments[a]);i.push(o),e.link.apply(this,i)}else if("object"==typeof e.link&&e.link.length){var u,c="function"==typeof e.link[e.link.length-1]?e.link[e.link.length-1]:angular.noop,p="function"==typeof e.link[e.link.length-1]?e.link.length-1:e.link.length;for(a=0;p>a;a++){switch(u=null,e.link[a]){case"$scope":u=t;break;case"$element":u=l;break;case"$attrs":u=n;break;case"$controller":u=r;break;case"$injector":u=o;break;default:u=o.get(e.link[a])||null}i.push(u)}c.apply(this,i)}}}}])),alt.components[e.name]},alt.component({name:"onReady",require:"ngInclude",restrict:"A",scope:{onReady:"&"},link:["$scope","$log","$element","$attrs","$rootScope","$controller",function(e,t,l,n,r,o){n.onReady&&e.onReady&&(!n.ngController||n.ngController&&r.controller)&&e.onReady()}]}),alt.factory("$uuid",function(){return{create:function(){function e(e){var t=(Math.random().toString(16)+"000000000").substr(2,8);return e?"-"+t.substr(0,4)+"-"+t.substr(4,4):t}return e()+e(!0)+e(!0)+e()},empty:function(){return"00000000-0000-0000-0000-000000000000"}}}),alt.run(["$rootScope","$q","$log",function(e,t,l){e.defaultRouteChanged=function(){var e=t.defer();return e.resolve(),e.promise},e.onRouteChanged=e.defaultRouteChanged,e.alt=alt}]),window.alt=alt;