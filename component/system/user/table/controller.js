define([
    'component/system/user/dbo',
    'component/system/usergroup/dbo',
    'component/ng/table',
    'component/alt/button/controller',
    'component/alt/filter/controller',
    'asset/js/momentjs'
], function(){
    return alt.component({
        name: 'systemUserTable',
        templateUrl: 'component/system/user/table/view.html',
        scope: {
            setting : '=?systemUserTable'
        },
        link: ['$scope', '$api', '$log', '$q', '$alert', '$button', '$table', 'Dbo_User', 'Dbo_Usergroup',
            function($scope, $api, $log, $q, $alert, $button, $table, Dbo_User, Dbo_Usergroup){
                $scope.elementid    = "objtable" + $scope.$id;
                $scope.moment       = moment;
                $scope.filter       = {};
                $scope.table        = $table($scope.elementid, Dbo_User);

                $scope.setting      = alt.extend({
                    elementid       : $scope.elementid,
                    table           : $scope.table,

                    // filter
                    isfilter        : true,
                    filter          : $scope.filter,

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
                        enabled     : function(id, info, status){
                            var button = {};
                            if(status){
                                button = $button('yes');
                                button.description = 'Enabled';
                            }
                            else{
                                button = $button('no');
                                button.description = 'Disabled';
                            }
                            button.title = '';
                            button.disabled = !$scope.setting.action || !$scope.setting.actions.disable;
                            button.onclick = function(){
                                var deferred = $q.defer();
                                if (confirm("Apakah anda yakin untuk " + (status ? "disable" : "enable") + " user '" + info + "'?")) {
                                    var user = {};
                                    user.userid = id;
                                    user.isenabled = status ? alt.registry.STATUS_NO: alt.registry.STATUS_YES;

                                    Dbo_User.update(user).then(function (response) {
                                            if (response.data == 1) {
                                                $alert.add((status ? "Disable" : "Enable") + ' user berhasil!', $alert.success);
                                            } else {
                                                $alert.add((status ? "Disable" : "Enable") + ' user gagal!', $alert.danger);
                                            }
                                            $scope.table.reload();
                                            deferred.resolve();
                                        },
                                        function (error) {
                                            $log.debug(error);
                                            $alert.add((status ? "Disable" : "Enable") + ' user gagal! <br/>' + error.message, $alert.danger);
                                            deferred.reject();
                                        });
                                }else{
                                    deferred.reject();
                                }
                                return deferred.promise;
                            };
                            return button;
                        },
                        logout      : function(username, info, status){
                            var button = {};
                            if(status){
                                button = $button('yes');
                                button.description = 'Login';
                                button.disabled = !$scope.setting.action || !$scope.setting.actions.logout;
                                button.onclick = function(){
                                    var deferred = $q.defer();
                                    if (confirm("Anda yakin akan force logout user '" + info + "'?")) {
                                        var user = {
                                            username: username
                                        };

                                        $api('auth').connect('forcelogout', user).then(function (response) {
                                                if (response.data == 1) {
                                                    $alert.add('Force logout user berhasil!', $alert.success);
                                                } else {
                                                    $alert.add('Force logout user gagal!', $alert.danger);
                                                }
                                                $scope.table.reload();
                                                deferred.resolve();
                                            },
                                            function (error) {
                                                $log.debug(error);
                                                $alert.add('Force logout user gagal! <br/>' + error.message, $alert.danger);
                                                deferred.reject();
                                            });
                                    }else{
                                        deferred.reject();
                                    }
                                    return deferred.promise;
                                };
                            }
                            else{
                                button = $button('no');
                                button.description = 'Tidak Login';
                                button.disabled = true;
                            }
                            button.title = '';
                            return button;
                        },
                        chpasswd    : function(data){
                            return $button('', {icon: 'icon-key', 'class': 'btn btn-primary', description: 'Ubah Password', href: alt.baseUrl + 'user/chpasswd?userid=' + data.userid});
                        },
                        edit        : function(data){
                            return $button('edit', {title:'', href: alt.baseUrl + 'user/edit?userid=' + data.userid});
                        },
                        remove      : function(data){
                            return $button('remove', {title:'',
                                onclick: function(){
                                    if(confirm("Anda yakin akan menghapus user '" + data.name + "'?")){
                                        if(typeof progressJs !== 'undefined') progressJs().start().autoIncrease(10, 100);
                                        Dbo_User.remove(data.userid).then(function(response){
                                            if(typeof progressJs !== 'undefined') progressJs().end();
                                            if(response.data == 1){
                                                $alert.add('User berhasil dihapus!', $alert.success);
                                            }else{
                                                $alert.add('User gagal dihapus!' + response.message, $alert.danger);
                                            }
                                            $scope.table.reload();
                                        }, function(error){
                                            if(typeof progressJs !== 'undefined') progressJs().end();
                                            $log.debug(error);
                                            $alert.add('User gagal dihapus! <br/>' + error.message, $alert.danger);
                                        });
                                    }
                                }
                            });
                        }
                    },
                    buttons         : function(data){
                        return [
                            $scope.setting.button.chpasswd(data),
                            $scope.setting.button.edit(data),
                            $scope.setting.button.remove(data)
                        ];
                    }
                }, $scope.setting);

                $scope.filtersetting = {};
                Dbo_Usergroup.keyvalues({key: 'usergroupid'}).then(function(response){
                    $scope.filtersetting.usergroup = response.data;
                }, function(error){
                    $log.debug(error);
                    $alert.add('Gagal mengambil data usergroup! <br/>' + error.message, $alert.danger);
                });
        }]
    });
});