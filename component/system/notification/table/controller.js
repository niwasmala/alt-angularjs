define([
    'component/system/notification/dbo',
    'component/ng/table',
    'component/alt/button/controller',
    'component/alt/filter/controller',
    'asset/js/momentjs'
], function(){
    return alt.component({
        name: 'systemNotificationTable',
        templateUrl: 'component/system/notification/table/view.html',
        scope: {
            setting : '=?systemNotificationTable'
        },
        link: ['$scope', '$api', '$log', '$q', '$alert', '$button', '$table', '$routeParams', 'Dbo_Notification',
            function($scope, $api, $log, $q, $alert, $button, $table, $routeParams, Dbo_Notification){
                $scope.elementid    = "objtable" + $scope.$id;
                $scope.moment       = moment;

                $scope.setting      = alt.extend({
                    filter          : {
                        category    : '',
                        type        : $routeParams['type']
                    }
                }, $scope.setting);

                $scope.table        = $table($scope.elementid, Dbo_Notification, $scope.setting.filter);

                $scope.setting      = alt.extend({
                    elementid       : $scope.elementid,
                    table           : $scope.table,

                    // filter
                    isfilter        : true,

                    // table action
                    refresh         : $scope.table.refresh,
                    reset           : $scope.table.reset,
                    excel           : $scope.table.excel,

                    // button
                    action          : true,
                    actions         : {
                        logout      : true,
                        disable     : true
                    },
                    button          : {
                        view        : function(link){
                            return $button('view', {title:'', href: alt.baseUrl + link});
                        }
                    },
                    buttons         : function(data){
                        return [
                            $scope.setting.button.view(data.link)
                        ];
                    }
                }, $scope.setting);

        }]
    });
});