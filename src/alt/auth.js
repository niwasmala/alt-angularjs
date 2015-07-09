alt.modules.auth = angular.module('alt-auth', ['angular-jwt'])
    .factory('$auth', ['$log', '$window', 'jwtHelper', function($log, $window, jwtHelper){
        // set default local data
        store.set(alt.application + '_token', store.get(alt.application + '_token') || '');
        store.set(alt.application + '_userdata', store.get(alt.application + '_userdata') || {});

        return {
            token: '',
            userdata: {},
            login: function(data){
                // data can be a string token or object userdata
                if(typeof data === 'string'){
                    // token
                    this.token = data;
                    this.userdata = jwtHelper.decodeToken(this.token);
                }else{
                    this.token = '';
                    this.userdata = data;
                }

                store.set(alt.application + '_token', this.token);
                store.set(alt.application + '_userdata', this.userdata);
            },
            logout: function(){
                this.token = '';
                this.userdata = {};
                store.set(alt.application + '_token', '');
                store.set(alt.application + '_userdata', {});
                store.set(alt.application + '_filter', '');
                store.set(alt.application + '_sorting', '');
            },
            islogin: function(){
                return this.token != '' ? !jwtHelper.isTokenExpired(this.token) : Object.keys(this.userdata).length > 0;
            },
            check: function(level){
                return level == 0 ? this.islogin() : this.islogin() && typeof this.userdata.userlevel !== 'undefined' && ((parseInt(this.userdata.userlevel) & parseInt(level)) > 0);
            },
            set_permission: function(level, redirect){
                redirect = typeof redirect !== 'undefined' ? redirect : true;
                if(!this.check(level)){
                    if(redirect){
                        $window.location.href = alt.baseUrl + 'error?code=403';
                    }
                    return false;
                }
                return true;
            }
        };
    }]);

alt.module('alt-auth', alt.modules.auth);