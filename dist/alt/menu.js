alt.loader.menu=function(){return"undefined"!=typeof alt.modules.menu?alt.modules.menu:(alt.menu="",alt.menuFolder=alt.menuFolder||"menu",alt.modules.menu=angular.module("alt-menu",[]).run(["$rootScope",function(e){e.menu=store.get(alt.application+"_menu")||{submenu:""},e.$watch("menu",function(n,u){n!=u&&(store.set(alt.application+"_menu",n),e.menu=n)},!0),e.$on("$routeChangeStart",function(n,u,t){alt.menu=alt.menuFolder+"/"+("viewer"==u.params.altaction?$auth.userdata.usergroupname:"public")+".html",e.menuLocation=alt.menu,e.menu.submenu=""})}]),void alt.module("alt-menu",alt.modules.menu))},"undefined"!=typeof define?define([],function(){alt.loader.menu()}):alt.loader.menu();