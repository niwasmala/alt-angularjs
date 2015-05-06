define([
    'component/system/user/dbo',
    'component/system/usergroup/dbo',
    'component/app/master/division/dbo'
], function(){
    return alt.component({
        name: 'systemUserDetail',
        templateUrl: 'component/system/user/detail/view.html',
        scope: {
            detail : '=?systemUserDetail'
        },
        link: ['$scope', '$log', '$validate', '$alert', '$q', 'Dbo_User', 'Dbo_Usergroup', 'Dbo_Master_Division', function($scope, $log, $validate, $alert, $q, Dbo_User, Dbo_Usergroup, Dbo_Master_Division){
            $scope.$validate    = $validate;

            $scope.detail       = alt.extend({
                action          : 'view',
                isretrieve      : true,
                is_validated    : function(){
                    return $validate()
                        .rule($validate.required($scope.detail.data.username), 'Username harus diisi!')
                        .rule($validate.required($scope.detail.data.name), 'Nama harus diisi!')
                        .rule($validate.required($scope.detail.data.usergroupid), 'Usergroup harus dipilih!')
                        .rule(!$scope.detail.data.email || ($scope.detail.data.email && $validate.email($scope.detail.data.email)), 'Email tidak valid!')
                        .rule($scope.detail.action != 'add' || ($scope.detail.action == 'add' && $validate.required($scope.detail.data.password)), 'Password harus diisi!')
                        .rule($scope.detail.action != 'add' || ($scope.detail.action == 'add' && $validate.required($scope.detail.data.passwordlagi)), 'Password lagi harus diisi!')
                        .rule($scope.detail.action != 'add' || ($scope.detail.action == 'add' && $validate.equals($scope.detail.data.password, $scope.detail.data.passwordlagi)), 'Password tidak sama!')
                        .check();
                },
                save            : function(isredirect){
                    isredirect = typeof isredirect == 'undefined' ? true : isredirect;
                    var deferred = $q.defer();

                    if($scope.detail.is_validated()){
                        var save = $scope.detail.action == 'add' ? Dbo_User.insert($scope.detail.data) : Dbo_User.update($scope.detail.data);
                        save.then(function(response){
                            $alert.add('Data berhasil disimpan!', $alert.success);
                            if (isredirect) window.location.href = alt.baseUrl + 'user/list';
                            deferred.resolve($scope.detail.data);
                        }, function(error){
                            $log.debug(error);
                            $alert.add('Gagal menyimpan data! <br/>' + error.message, $alert.danger);
                            deferred.reject(error);
                        });
                    }else{
                        deferred.reject();
                    }

                    return deferred.promise;
                },
                data            : {},
                setting         : {
                    username : {
                        show     : true,
                        disabled : $scope.detail.action != 'add'
                    },
                    name : {
                        show     : true,
                        disabled : $scope.detail.action == 'view'
                    },
                    address : {
                        show     : true,
                        disabled : $scope.detail.action == 'view'
                    },
                    email : {
                        show     : true,
                        disabled : $scope.detail.action == 'view'
                    },
                    usergroup : {
                        show     : true,
                        disabled : $scope.detail.action == 'view'
                    },
                    division : {
                        show     : false,
                        disabled : $scope.detail.action == 'view'
                    },
                    password : {
                        show     : $scope.detail.action == 'add',
                        disabled : $scope.detail.action != 'add'
                    },
                    passwordlagi : {
                        show     : $scope.detail.action == 'add',
                        disabled : $scope.detail.action != 'add'
                    }
                }
            }, $scope.detail);

            if($scope.detail.isretrieve && ($scope.detail.action == 'edit' || $scope.detail.action == 'view')){
                Dbo_User.retrieve($scope.detail.data.userid).then(function(response){
                    $scope.detail.data = response.data;
                }, function(error){
                    $log.debug(error);
                    $alert.add('Gagal mengambil data user! <br/>' + error.message, $alert.danger);
                });
            }

            $scope.usergroup = [];
            Dbo_Usergroup.list().then(function(response){
                $scope.usergroup = response.data;
            }, function(error){
                $log.debug(error);
                $alert.add('Gagal mengambil data usergroup! <br/>' + error.message, $alert.danger);
            });

            $scope.division = [];
            Dbo_Master_Division.list().then(function(response){
                $scope.division = response.data;
            }, function(error){
                $log.debug(error);
                $alert.add('Gagal mengambil data divisi! <br/>' + error.message, $alert.danger);
            });

            $scope.usernamevalid = true;
            if($scope.detail.action == 'add'){
                $scope.check_username = function(){
                    if($scope.detail.data.username.trim() != ""){
                        Dbo_User.isexist($scope.detail.data).then(function(response){
                            var jum = response.data;
                            $scope.usernamevalid = jum == 0;
                        }, function(error){
                            $log.debug(error);
                            $alert.add('Gagal mengecek username! <br/>' + error.message, $alert.danger);
                        });
                    }
                };
                $scope.$watch("detail.data.username", function(){
                    if($scope.detail.data.username){
                        $scope.detail.data.username = $validate.username($scope.detail.data.username);
                        $scope.check_username();
                    }
                });
            }

            $scope.$watch("detail.data.usergroupid", function(value){
                switch (value){
                    case '4':
                        $scope.detail.setting.division.show = true;
                        break;
                    default:
                        $scope.detail.setting.division.show = false;
                        break;
                }
            });
        }]
    });
});