define([
], function(){
    return alt.component({
        name: 'altStep',
        require: '^altWizard',
        templateUrl: 'component/alt/wizard/step/view.html',
        scope: {
            altStep: '=?'
        },
        link: ['$scope', '$log', '$controller', '$q', function($scope, $log, $controller, $q){
            $scope.altStep = angular.extend({
                save: function(){
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
            }, $scope.altStep);
            $controller.add($scope.altStep);
        }]
    });
});