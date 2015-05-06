define([
    'component/system/user/detail/controller',
    'component/alt/toolbar/controller',
    'component/alt/button/controller',
    'component/alt/breadcrumbs/controller'
], function(){
    return [
        '$scope', '$routeParams', '$log', '$auth', '$button',
        function($scope, $routeParams, $log, $auth, $button){
            $auth.set_permission(3);

            $scope.detail = {
                action  : 'edit',
                data    : {
                    userid  : $routeParams.userid
                }
            };

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
                    'class': '',
                    'href': alt.baseUrl + 'user/list'
                },
                {
                    'title': 'Edit',
                    'class': 'active'
                }
            ];

            //toolbar buttons
            $scope.save = $button('save');
            $scope.save.onclick = function(){
                $scope.detail.save();
            };

            $scope.back = $button('back');
            $scope.back.href = alt.baseUrl + 'user/list';
        }];
});