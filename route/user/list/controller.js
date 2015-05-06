define([
    'component/system/user/table/controller',
    'component/alt/toolbar/controller',
    'component/alt/button/controller',
    'component/alt/breadcrumbs/controller'
], function(){
    return [
        '$scope', '$routeParams', '$log', '$auth', '$button',
        function($scope, $routeParams, $log, $auth, $button){
            $auth.set_permission(3);

            // breadcrumbs
            $scope.breadcrumbs = [
                {
                    'title': alt.registry.modules[alt.registry.MODULE_FOUNDATION],
                    'class': '',
                    'href': alt.baseUrl + 'dashboard/' + alt.registry.MODULE_FOUNDATION
                },
                {
                    'title': 'Administrator',
                    'class': ''
                },
                {
                    'title': 'User',
                    'class': 'active'
                }
            ];

            // table
            $scope.table = {};

            // toolbar buttons
            $scope.add = $button('add');
            $scope.add.href = alt.baseUrl + 'user/add';

            $scope.excel = $button('excel');
            $scope.excel.onclick = function(){
                return $scope.table.excel();
            }
        }];
});