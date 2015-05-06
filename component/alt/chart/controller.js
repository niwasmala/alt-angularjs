define([
    'asset/js/amcharts/amcharts'
], function(){
    AmCharts.isReady = true;

    return alt.component({
        name: 'altChart',
        templateUrl: 'component/alt/chart/view.html',
        scope: {
            data: '=?altChart',
            setting: '=?'
        },
        isskip: true,
        link: ['$scope', '$log', '$element', '$alert', '$validate', '$timeout', '$button', '$q', function($scope, $log, $element, $alert, $validate, $timeout, $button, $q){
            $scope.data     = alt.extend([], $scope.data);
            $scope.setting  = alt.extend({
                isautoreload: true,
                elementid   : "chart" + $scope.$id,
                chart       : {
                    height: "100%",
                    labelsEnabled: false,
                    autoMargins: false,
                    marginTop: 0,
                    marginBottom: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    pullOutRadus: 0
                },
                objchart    : {},
                style       : {},
                reload      : function(data){
                    $scope.data = data || $scope.data;

                    if($scope.setting.objchart.dataProvider){
                        $scope.setting.objchart.dataProvider = $scope.data;
                        $scope.setting.objchart.validateData();
                    }else{
                        $scope.setting.objchart = AmCharts.makeChart($scope.setting.elementid, alt.extend({
                            dataProvider: $scope.data
                        }, $scope.setting.chart));
                    }
                }
            }, $scope.setting);

            $timeout($scope.setting.reload);
            if($scope.setting.isautoreload) $scope.$watch('data', function(newvalue, oldvalue){
                if(newvalue != oldvalue) $scope.setting.reload();
            })
        }]
    });
});