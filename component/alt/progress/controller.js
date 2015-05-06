define([
], function(){
    return alt.component({
        name: 'altProgress',
        templateUrl: 'component/alt/progress/view.html',
        scope: {
            altProgress: '=?'
        },
        link: ['$scope', '$log', function($scope, $log){
            $scope.altProgress = alt.extend({
                type: '',
                bars: [
                    {
                        'class': 'info',
                        value: 50
                    }
                ]
            }, $scope.altProgress);
            $scope.altProgress.type = $scope.altProgress.type || '';
            $scope.altProgress.bars = $scope.altProgress.bars || [
                {
                    'class': 'info',
                    value: 50
                }
            ];
        }]
    });
});