alt.loader.dbo = function(){
    if(typeof alt.modules.dbo !== 'undefined')
        return alt.modules.dbo;

    alt.modules.dbo = angular.module('alt-dbo', [])
        .factory("$dbo", ["$log", "$q", "$alert", "$loading", "$api", "$db", function($log, $q, $alert, $loading, $api, $db){
            var $dbo = function(url, schema){
                var res = {};

                // api and database
                res.db = $db(url, schema);
                res.api = $api(url, schema.pkey, {
                    connect: function(params){
                        $loading.show();
                    },
                    success: function(response){
                        $loading.close();
                    },
                    error: function(error, params, deferred, iscancelled){
                        $loading.close();
                        if(iscancelled) return true;

                        error.message = error.message || (error.data ? error.data.message : "Error tidak diketahui");
                        if(typeof error.message === "string"){
                            $alert.add(error.message, $alert.danger);
                        }else if(error.message.length){
                            angular.forEach(error.message, function(message){
                                $alert.add(message, $alert.danger);
                            });
                        }
                    }
                });

                // function needed
                res.count = function(data){
                    return alt.serverUrl ? res.api.count(data) : res.db.count(data);
                };

                res.list = function(data){
                    return alt.serverUrl ? res.api.list(data) : res.db.list(data);
                };

                res.table = function(data){
                    return alt.serverUrl ? res.api.table(data) : res.db.table(data);
                };

                res.keyvalues = function(data){
                    return alt.serverUrl ? res.api.keyvalues(data) : res.db.keyvalues(data);
                };

                res.insert = function(data){
                    return alt.serverUrl ? res.api.insert(data) : res.db.insert(data);
                };

                res.update = function(data){
                    return alt.serverUrl ? res.api.update(data) : res.db.update(data);
                };

                res.retrieve = function(data){
                    return alt.serverUrl ? res.api.retrieve(data) : res.db.retrieve(data);
                };

                res.remove = function(data){
                    return alt.serverUrl ? res.api.remove(data) : res.db.remove(data);
                };

                res.isexist = function(data){
                    return alt.serverUrl ? res.api.isexist(data) : res.db.isexist(data);
                };

                return res;
            };

            // set schema type
            $dbo.NUMBER = $db.NUMBER;
            $dbo.INTEGER = $db.INTEGER;
            $dbo.STRING = $db.STRING;
            $dbo.DATE_TIME = $db.DATE_TIME;
            $dbo.BOOLEAN = $db.BOOLEAN;
            $dbo.ARRAY_BUFFER = $db.ARRAY_BUFFER;
            $dbo.OBJECT = $db.OBJECT;

            // set order type
            $dbo.ASC = $db.ASC;
            $dbo.DESC = $db.DESC;

            return $dbo;
        }]);

    alt.module('alt-dbo', alt.modules.dbo);

};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.dbo();
    });
}else{
    alt.loader.dbo();
}