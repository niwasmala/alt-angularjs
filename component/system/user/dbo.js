define([
], function(){
    alt.factory('Dbo_User', ['$api', '$log', function($api, $log){
        return $api('user');
    }]);
});