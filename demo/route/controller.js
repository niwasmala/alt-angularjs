define([
], function(){
    return ['$scope', '$routeParams', '$log', '$location', '$auth', function($scope, $routeParams, $log, $location, $auth){
        $log.debug(document.getElementById("test"));
        $scope.onready = function(){
            $log.debug(document.getElementById("test"));
            $scope.location = 'route/controller.js';
            $log.debug($scope.location);
            $log.debug($auth);
        };
    }];
});