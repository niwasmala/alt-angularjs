define([
], function(){
    alt.factory('Dbo_Usergroup', ['$api', '$log', function($api, $log){
        return $api('usergroup');
    }]);
});