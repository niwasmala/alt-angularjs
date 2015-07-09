alt.modules.storage = angular.module('alt-storage', [])
    .factory('$storage', ['$log', '$q', function($log, $q){
        return function(table, pk){
            pk = pk || table + 'id';

            // set default local data
            store.set(alt.application + '_data', store.get(alt.application + '_data') || {});

            var $storage = {
                table: table,
                pk: pk,

                // response
                response: function(data, status){
                    status = status || 0;
                    return {
                        status: status,
                        data: status == 0 ? data : null,
                        message: status != 0 ? data : ''
                    };
                },

                // primitive function for get and save data
                get: function(){
                    var data = store.get(alt.application + '_data');
                    var res = data[table] || [];

                    var deferred = $q.defer();
                    deferred.resolve($storage.response(res));
                    return deferred.promise;
                },
                save: function(data){
                    var alldata = store.get(alt.application + '_data');
                    alldata[table] = data;
                    store.set(alt.application + '_data', alldata);

                    var deferred = $q.defer();
                    deferred.resolve($storage.response(1));
                    return deferred.promise;
                },

                // crud function supported
                list: function(){
                    return $storage.get();
                },
                search: function(key, value){
                    var deferred = $q.defer();

                    $storage.list(table).then(function(response){
                        var data = response.data;
                        var res = {
                            id: -1,
                            data: null
                        };

                        for(var i=0; i<data.length; i++){
                            if(data[i][key] == value){
                                res.id = i;
                                res.data = data[i][key];
                                break;
                            }
                        }

                        if(res.id == -1){
                            deferred.reject($storage.response('Data tidak ditemukan', res.id));
                        }else{
                            deferred.resolve($storage.response(res));
                        }
                    });
                    return deferred.promise;
                },
                count: function(){
                    var deferred = $q.defer();

                    $storage.list(table).then(function(response) {
                        var data = response.data;
                        var res = data.length;

                        deferred.resolve($storage.response(res));
                    });

                    return deferred.promise;
                },
                insert: function(row){
                    var deferred = $q.defer();

                    $storage.list(table).then(function(response) {
                        var data = response.data;
                        row[pk] = parseInt(data[data.length-1] ? data[data.length-1][pk] || 0 : 0) + 1;
                        data.push(row);

                        $storage.save(data).then(function(){
                            deferred.resolve($storage.response(res));
                        });
                    });

                    return deferred.promise;
                },
                retrieve: function(index){
                    var deferred = $q.defer();

                    $storage.search(pk, index).then(function(response){
                        var row = response.data,
                            res = row.data;

                        deferred.resolve($storage.response(res));
                    }, function(response){
                        deferred.reject($storage.response(response));
                    });

                    return deferred.promise;
                },
                update: function(newdata){
                    var deferred = $q.defer();

                    $storage.list().then(function(response){
                        var data = response.data;

                        $storage.search(pk, newdata[pk]).then(function(response){
                            var row = response.data;

                            data[row.id] = newdata;
                            $storage.save(data).then(function(){
                                deferred.resolve($storage.response(1));
                            });
                        }, function(response){
                            deferred.reject($storage.response('Tidak ada data yang diupdate', -1));
                        });
                    });

                    return deferred.promise;
                },
                remove: function(id){
                    var deferred = $q.defer();

                    $storage.list().then(function(response){
                        var data = response.data;

                        $storage.search(pk, newdata[pk]).then(function(response){
                            var row = response.data;

                            data.splice(row.id, 1);
                            $storage.save(data).then(function(){
                                deferred.resolve($storage.response(1));
                            });
                        }, function(response){
                            deferred.reject($storage.response('Tidak ada data yang dihapus', -1));
                        });
                    });
                },
                keyvalues: function(key, value){
                    value = value || '';

                    var deferred = $q.defer();

                    $storage.list(table).then(function(response){
                        var data = response.data;
                        var res = {};
                        for(var i=0; i<data.length; i++){
                            res[data[i][key]] = value != '' ? data[i][value] : data[i];
                        }

                        deferred.resolve(res);
                    });

                    return deferred.promise;
                },
                isexist: function(key, value){
                    var deferred = $q.defer();

                    $storage.list().then(function(response){
                        var data = response.data;
                        var res = 0;

                        for(var i=0; i<data.length; i++){
                            res += data[i][key] == value ? 1 : 0;
                        }
                        deferred.resolve(res);
                    });

                    return deferred.promise;
                }
            };

            return $storage;
        };
    }]);

alt.module('alt-storage', alt.modules.storage);