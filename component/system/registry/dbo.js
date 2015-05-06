define([
], function(){
    alt.factory('Dbo_Registry', ['$api', '$log', function($api, $log){
        return $api('registry', 'regkey');
    }]);
});