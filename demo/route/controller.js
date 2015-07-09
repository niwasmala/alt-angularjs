define([
], function(){
    return ['$scope', '$routeParams', '$log', '$location', function($scope, $routeParams, $log, $location){
        $log.debug('controllerReady', document.getElementById("test"));
        $scope.location = 'route/controller';
        $scope.include = {
            tes: ''
        };
        $scope.includeReady = function(){
            $log.debug('includeReady', document.getElementById("included"));
            $scope.include.tes = 'abc';
        };
    }];
});