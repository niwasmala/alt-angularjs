alt.loader.auth=function(){return"undefined"!=typeof alt.modules.auth?alt.modules.auth:(alt.modules.auth=angular.module("alt-auth",["angular-jwt"]).factory("$auth",["$log","$window","jwtHelper",function(t,e,a){return store.set(alt.application+"_token",store.get(alt.application+"_token")||""),store.set(alt.application+"_userdata",store.get(alt.application+"_userdata")||{}),{token:"",userdata:{},set_token:function(t){this.token=t,store.set(alt.application+"_token",this.token)},set_userdata:function(t){this.userdata=t,store.set(alt.application+"_userdata",this.userdata)},login:function(t){"string"==typeof t?(this.set_token(t),this.set_userdata(a.decodeToken(this.token))):this.set_userdata(t)},logout:function(){this.token="",this.userdata={},store.set(alt.application+"_token",""),store.set(alt.application+"_userdata",{}),store.set(alt.application+"_filter",""),store.set(alt.application+"_sorting","")},islogin:function(){return""!=this.token?!a.isTokenExpired(this.token):Object.keys(this.userdata).length>0},check:function(t){return 0==t?this.islogin():this.islogin()&&"undefined"!=typeof this.userdata.userlevel&&(parseInt(this.userdata.userlevel)&parseInt(t))>0},set_permission:function(t,a){return a="undefined"!=typeof a?a:!0,this.check(t)?!0:(a&&(e.location.href=alt.baseUrl+"error?code=403"),!1)}}}]).config(["$provide","$httpProvider",function(t,e){t.factory("authHttpInterceptor",["$auth","$log","$q","$window",function(t,e,a,o){return{request:function(e){return t.token&&(e.headers.Authorization="Bearer "+t.token),e}}}]),e.interceptors.reverse().push("authHttpInterceptor"),e.interceptors.reverse()}]).run(["$rootScope","$auth","$log",function(t,e,a){t.$auth=e,""!=store.get(alt.application+"_token")&&e.login(store.get(alt.application+"_token")),""!=store.get(alt.application+"_userdata")&&e.login(store.get(alt.application+"_userdata"))}]),void alt.module("alt-auth",alt.modules.auth))},"undefined"!=typeof define?define([],function(){alt.loader.auth()}):alt.loader.auth();