define([
    'component/system/user/dbo',
    'component/alt/toolbar/controller',
    'component/alt/button/controller',
    'component/alt/breadcrumbs/controller'
], function(){
    return [
        '$scope', '$auth', '$routeParams', '$log', '$button', '$validate', '$alert', '$q', 'Dbo_User',
        function($scope, $auth, $routeParams, $log, $button, $validate, $alert, $q, Dbo_User){
            $scope.isadmin = $auth.check(3);
            $scope.user = {};
            var userid;
            if($scope.isadmin && $routeParams.userid) userid = $routeParams.userid;
            else userid = $auth.userdata.userid;
            Dbo_User.retrieve(userid).then(function(response){
                $scope.user = response.data;
            },
            function(error){
                $log.debug(error);
                $alert.add('Gagal mengambil data user!', $alert.danger);
            });

            $scope.is_validated     = function(){
                return $validate()
                    .rule($scope.isadmin || (!$scope.isadmin && $validate.required($scope.user.oldpassword)), 'Password lama harus diisi!')
                    .rule($validate.required($scope.user.newpassword), 'Password baru harus diisi!')
                    .rule($validate.required($scope.user.newpassword2), 'Password baru lagi harus diisi!')
                    .rule($validate.equals($scope.user.newpassword, $scope.user.newpassword2), 'Password tidak sama!')
                    .check();
            };
            if($scope.isadmin) {
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
                        'title': 'Ubah Password',
                        'class': 'active'
                    }
                ];
            }
            else{
                $scope.breadcrumbs = [
                    {
                        'title': 'User',
                        'class': ''
                    },
                    {
                        'title': 'Ubah Password',
                        'class': 'active'
                    }
                ];
            }

            //toolbar buttons
            $scope.save = $button('save');
            $scope.save.onclick = function(){
                var deferred = $q.defer();
                if($scope.is_validated()){
                    Dbo_User.connect('chpasswd', $scope.user).then(function(response){
                        if($scope.isadmin){
                            $alert.add('Password berhasil diubah!', $alert.success, 1);
                            deferred.resolve();
                            window.location.href = alt.baseUrl + 'user/list';
                        }
                        else{
                            $alert.add('Password berhasil diubah!', $alert.success);
                            deferred.reject();
                        }
                    },
                    function(error){
                        $log.debug(error);
                        $alert.add('Password gagal diubah! <br/>' + error.message, $alert.danger);
                        deferred.reject();
                    });
                }else{
                    deferred.reject();
                }
                return deferred.promise;
            };

            if($scope.isadmin){
                $scope.back = $button('back');
                $scope.back.href = alt.baseUrl + 'user/list';
            }
        }];
});