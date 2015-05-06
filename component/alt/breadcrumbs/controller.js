define([
], function(){
    return alt.component({
        name: 'altBreadcrumbs',
        templateUrl: 'component/alt/breadcrumbs/view.html',
        scope: {
            altBreadcrumbs: '=?'
        },
        link: ['$scope', '$log', function($scope, $log){
            $scope.altBreadcrumbs = alt.extend([
                {
                    'title': 'Home',
                    'class': 'active',
                    'href': ''
                }
            ], $scope.altBreadcrumbs);
        }]
    });
});