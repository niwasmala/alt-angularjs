alt.loader.db = function(){
    if(typeof alt.modules.db !== 'undefined')
        return alt.modules.db;

    alt.modules.db = angular.module('alt-db', [])
        .factory("$db", ["$log", "$q", "$api", "$interval", function($log, $q, $api, $interval){
            var $db = function(url, schema){
                var res = {lf: lf};
                $db.connection = null;
                res.schema = schema || {};
                res.tablename = (url + "").split("/").join("_");

                // create table
                var table = $db.schema_builder.createTable(res.tablename);

                // set fields
                res.schema.fields = res.schema.fields || [];
                angular.forEach(res.schema.fields, function(val, key){
                    table.addColumn(key, val);

                    if(!res.schema.pkey || (res.schema.pkey && key != res.schema.pkey))
                        table.addNullable([key]);
                });

                // set pkey
                if(res.schema.pkey) {
                    res.schema.pkey = typeof res.schema.pkey === "object" ? res.schema.pkey : [res.schema.pkey];
                    table.addPrimaryKey(res.schema.pkey, res.schema.autoinc);
                }

                // set index
                res.schema.index = res.schema.index || [];
                angular.forEach(res.schema.index, function(val){
                    table.addIndex(val.id, val.fields, false, val.order);
                });

                // function needed
                res.parser = function(data, table){
                    data = data || {};
                    var res = {
                        fields: [],
                        where: [],
                        order: [],
                        limit: null,
                        offset: null
                    };

                    angular.forEach(data, function(val, key){
                        switch((key + "").toLowerCase()){
                            case "select":
                                var tmp = (data.select + "").split(",");
                                angular.forEach(tmp, function(val, key){
                                    val = val.trim();
                                    if(table[val]){
                                        res.fields.push(table[val]);
                                    }
                                });
                                break;
                            case "where":
                                switch(typeof data.where){
                                    case "string":
                                        var tmp = data.where.split(" "),
                                            key = tmp[0] + "",
                                            operator = tmp[1] + "",
                                            value = (tmp[2] + "").split("'").join("");

                                        switch(operator.toLowerCase()){
                                            case "=":
                                                operator = "eq";
                                                break;
                                            case "<>":
                                                operator = "neq";
                                                break;
                                            case ">":
                                                operator = "gt";
                                                break;
                                            case "<":
                                                operator = "lt";
                                                break;
                                            case ">=":
                                                operator = "gte";
                                                break;
                                            case "<=":
                                                operator = "lte";
                                                break;
                                            case "in":
                                                operator = "in";
                                                break;
                                            case "like":
                                            default:
                                                operator = "match";
                                                value = new RegExp(value, "i");
                                                break;
                                        }

                                        if(table[key])
                                            res.where.push(table[key][operator](value));
                                        break;
                                    case "object":
                                        angular.forEach(data.where, function(val, key){
                                            var tmp = val.split(" "),
                                                key = tmp[0] + "",
                                                operator = tmp[1] + "",
                                                value = (tmp[2] + "").split("'").join("");

                                            switch(operator.toLowerCase()){
                                                case "=":
                                                    operator = "eq";
                                                    break;
                                                case "<>":
                                                    operator = "neq";
                                                    break;
                                                case ">":
                                                    operator = "gt";
                                                    break;
                                                case "<":
                                                    operator = "lt";
                                                    break;
                                                case ">=":
                                                    operator = "gte";
                                                    break;
                                                case "<=":
                                                    operator = "lte";
                                                    break;
                                                case "in":
                                                    operator = "in";
                                                    break;
                                                case "like":
                                                default:
                                                    operator = "match";
                                                    value = new RegExp(value, "i");
                                                    break;
                                            }

                                            if(table[key])
                                                res.where.push(table[key][operator](value));
                                        });
                                        break;
                                }
                                break;
                            case "limit":
                                res.limit = parseInt(data.limit);
                                break;
                            case "offset":
                                res.offset = parseInt(data.offset);
                                break;
                            case "order":
                                var tmp = (data.order + "").split(",");
                                angular.forEach(tmp, function(val, key){
                                    var tmp2 = (val + "").split(" "),
                                        field = val[0],
                                        sort = val[1].toLowerCase();

                                    if(table[field]){
                                        res.order.push([table[field], sort == "desc" ? lf.Order.DESC : lf.Order.ASC]);
                                    }
                                });
                                break;
                            default:
                                // table fields
                                if(table[key]){
                                    tmp = (val + "").split(" ");
                                    var operator = tmp.length > 1 && ["=", "<>", ">", "<", ">=", "<=", "in", "like"].indexOf(tmp[0]) > -1 ? tmp[0] : "like",
                                        value = (tmp.length > 1 ? (tmp[1] + "").split("'").join("") : tmp[0]) + "";

                                    switch(operator.toLowerCase()){
                                        case "=":
                                            operator = "eq";
                                            break;
                                        case "<>":
                                            operator = "neq";
                                            break;
                                        case ">":
                                            operator = "gt";
                                            break;
                                        case "<":
                                            operator = "lt";
                                            break;
                                        case ">=":
                                            operator = "gte";
                                            break;
                                        case "<=":
                                            operator = "lte";
                                            break;
                                        case "in":
                                            operator = "in";
                                            break;
                                        case "like":
                                        default:
                                            operator = "match";
                                            value = new RegExp(value, "i");
                                            break;
                                    }

                                    res.where.push(table[key][operator](value));
                                }
                                break;
                        }
                    });

                    if(res.fields.length == 0){
                        delete res.fields;
                    }

                    if(res.order.length == 0){
                        delete res.order;
                    }

                    if(res.limit == null){
                        delete res.limit;
                    }

                    if(res.offset == null){
                        delete res.offset;
                    }

                    if(res.where.length == 0){
                        delete res.where;
                    }else{
                        res.where = res.where.length > 1 ? lf.op.and.apply($db.connection, res.where) : res.where[0];
                    }

                    return res;
                };

                res.count = function(data){
                    data = data || {};
                    var deferred = $q.defer();

                    $db.connect().then(function(){
                        var table = $db.connection.getSchema().table(res.tablename),
                            parser = res.parser(data, table),
                            query;

                        // select
                        query = $db.connection.select(lf.fn.count().as("numofrow"));
                        query.from(table);

                        if(parser.where)    query.where(parser.where);

                        return query.exec();
                    }).then(function(result){
                        deferred.resolve({status: 200, data: result && result.length > 0 ? result[0].numofrow : 0});
                    }).catch(function(error){
                        deferred.reject({status: error.code, message: error.message})
                    });

                    return deferred.promise;
                };

                res.list = function(data){
                    data = data || {};
                    var deferred = $q.defer();

                    $db.connect().then(function(){
                        var table = $db.connection.getSchema().table(res.tablename),
                            parser = res.parser(data, table),
                            query;

                        // select
                        query = parser.fields ? $db.connection.select.apply($db.connection, parser.fields) : $db.connection.select();
                        query.from(table);

                        if(parser.where)    query.where(parser.where);
                        if(parser.limit)    query.limit(parser.limit);
                        if(parser.offset)   query.skip(parser.offset);
                        if(parser.order){
                            angular.forEach(parser.order, function(val){
                                query = query.orderBy.apply($db.connection, val);
                            });
                        }

                        return query.exec();
                    }).then(function(result){
                        deferred.resolve({status: 200, data: result});
                    }).catch(function(error){
                        deferred.reject({status: error.code, message: error.message})
                    });

                    return deferred.promise;
                };

                res.keyvalues = function(data){
                    data = data || {};
                    var deferred = $q.defer(),
                        result = {status: 200, data: {}};

                    res.list(data).then(function(response){
                        data.key = data.key || res.schema.pkey;
                        angular.forEach(response.data, function(val, key){
                            result.data[val[data.key]] = data.values && val[data.values] ? val[data.values] : val;
                        });
                        deferred.resolve(result);
                    }).catch(function(error){
                        deferred.reject({status: error.code, message: error.message})
                    });

                    return deferred.promise;
                };

                res.table = function(data){
                    data = data || {};
                    var deferred = $q.defer(),
                        result = {status: 200, data: {}};

                    res.count(data).then(function(response){
                        result.data["total"] = response.data;
                        return res.list(data);
                    }).then(function(response){
                        result.data["list"] = response.data;
                        deferred.resolve(result);
                    }).catch(function(error){
                        deferred.reject({status: error.code, message: error.message})
                    });

                    return deferred.promise;
                };

                res.insert = function(data){
                    data = data || {};
                    var deferred = $q.defer();

                    $db.connect().then(function(){
                        var table = $db.connection.getSchema().table(res.tablename),
                            row = table.createRow(data);

                        return $db.connection.insert().into(table).values([row]).exec();
                    }).then(function(result){
                        deferred.resolve({status: 200, data: result[0][res.schema.pkey]});
                    }).catch(function(error){
                        deferred.reject({status: error.code, message: error.message})
                    });

                    return deferred.promise;
                };

                res.update = function(data){
                    data = data || {};
                    var deferred = $q.defer();

                    $db.connect().then(function(){
                        var table = $db.connection.getSchema().table(res.tablename),
                            parser = res.parser({where: data.where || ""}, table),
                            query;

                        // select
                        query = $db.connection.update(table);

                        angular.forEach(data, function(val, key){
                            if(table[key]){
                                query.set(table[key], val);
                            }
                        });

                        if(parser.where){
                            query.where(parser.where);
                        }else if(data[res.schema.pkey]){
                            query.where(table[res.schema.pkey].eq(data[res.schema.pkey]));
                        }

                        return query.exec();
                    }).then(function(result){
                        deferred.resolve({status: 200, data: 1});
                    }).catch(function(error){
                        deferred.reject({status: error.code, message: error.message})
                    });

                    return deferred.promise;
                };

                res.retrieve = function(data){
                    data = data || {};
                    data.limit = 1;
                    if(data[res.schema.pkey])
                        data[res.schema.pkey] = "= " + data[res.schema.pkey];

                    var deferred = $q.defer();

                    res.list(data).then(function(response){
                        if(response.data.length <= 0)
                            throw new Error("Data tidak ditemukan!", 500);

                        response.data = response.data[0];
                        deferred.resolve(response);
                    }).catch(function(error){
                        deferred.reject({status: error.code || 500, message: error.message})
                    });

                    return deferred.promise;
                };

                res.remove = function(data){
                    data = data || {};
                    var deferred = $q.defer();

                    $db.connect().then(function(){
                        var table = $db.connection.getSchema().table(res.tablename),
                            parser = res.parser({where: data.where || ""}, table),
                            query;

                        // select
                        query = $db.connection.delete().from(table);

                        if(parser.where){
                            query.where(parser.where);
                        }else if(data[res.schema.pkey]){
                            query.where(table[res.schema.pkey].eq(data[res.schema.pkey]));
                        }

                        return query.exec();
                    }).then(function(result){
                        deferred.resolve({status: 200, data: 1});
                    }).catch(function(error){
                        deferred.reject({status: error.code, message: error.message})
                    });

                    return deferred.promise;
                };

                res.isexist = function(data){
                    data = data || {};
                    var deferred = $q.defer();

                    res.count(data).then(function(response){
                        response.data = response.data || 0;
                        deferred.resolve()
                    }).catch(function(error){
                        deferred.reject({status: error.code, message: error.message})
                    });

                    return deferred.promise;
                };

                return res;
            };

            // create connection
            $db.schema_builder = lf.schema.create(alt.application, (+new Date())/1000);
            $db.isconnecting = false;
            $db.connection = null;
            $db.connect = function(){
                var deferred = $q.defer();

                if($db.connection !== null){
                    $db.isconnecting = false;
                    deferred.resolve($db.connection);
                }else if($db.isconnecting) {
                    var interval = $interval(function(){
                        if($db.connection){
                            $interval.cancel(interval);
                            $db.isconnecting = false;
                            deferred.resolve($db.connection);
                        }
                    }, 100);
                }else{
                    $db.isconnecting = true;
                    $db.schema_builder.connect().then(function(db){
                        $db.isconnecting = false;
                        $db.connection = db;
                        deferred.resolve($db.connection);
                    });
                }

                return deferred.promise;
            };

            // set schema type
            $db.NUMBER = lf.Type.NUMBER;
            $db.INTEGER = lf.Type.INTEGER;
            $db.STRING = lf.Type.STRING;
            $db.DATE_TIME = lf.Type.DATE_TIME;
            $db.BOOLEAN = lf.Type.BOOLEAN;
            $db.ARRAY_BUFFER = lf.Type.ARRAY_BUFFER;
            $db.OBJECT = lf.Type.OBJECT;

            // set order type
            $db.ASC = lf.Order.ASC;
            $db.DESC = lf.Order.DESC;

            return $db;
        }]);

    alt.module('alt-db', alt.modules.db);

};

if(typeof define !== 'undefined') {
    define([], function () {
        alt.loader.db();
    });
}else{
    alt.loader.db();
}