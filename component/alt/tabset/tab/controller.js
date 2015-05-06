define([
], function(){
    return alt.component({
        name: 'altTab',
        require: '^altTabset',
        templateUrl: 'component/alt/tabset/tab/view.html',
        scope: {
            altTab: '=?'
        },
        link: ['$scope', '$log', '$controller', function($scope, $log, $controller){
            $scope.altTab = angular.extend({
                id: $scope.$id,
                title: '',
                detail: {},
                show: true,
                selected: false
            }, $scope.altTab);

            $controller.add($scope.altTab);
        }]
    });
});