define([
    'asset/js/momentjs.min',
    'component/alt/button/controller'
], function(){
    return alt.component({
        name: 'altDropdown',
        templateUrl: 'component/alt/dropdown/view.html',
        scope: {
            dropdown: '=?altDropdown',
            setting: '=?'
        },
        isskip: true,
        link: ['$scope', '$log', '$element', '$alert', '$validate', '$timeout', '$button', '$q',
            function($scope, $log, $element, $alert, $validate, $timeout, $button, $q){
                $scope.dropdown     = $scope.dropdown || '';

                $scope.setting      = alt.extend({
                    show            : true,
                    required        : false,
                    disabled        : false,
                    readonly        : false,
                    isalwaysvalid   : true,
                    class           : "span12",
                    data            : [],
                    options         : [],
                    maxshow         : 10,
                    getData         : function(term){
                        var q = (term + '').toLowerCase(),
                            deferred = $q.defer(),
                            data = [];

                        for(var i=0; i<$scope.setting.data.length; i++) if($scope.setting.maxshow == 0 || data.length <= $scope.setting.maxshow) {
                            var label = ($scope.setting.data[i].label + '').toLowerCase();
                            if(q == '' || label.indexOf(q) >= 0){
                                data.push($scope.setting.data[i]);
                            }
                        }

                        deferred.resolve({status: 0, data: data});
                        return deferred.promise;
                    },
                    select  : function(data){
                        $scope.dropdown = data.id;
                        $scope.data = angular.copy(data);
                        $scope.data.text = $scope.data.label;
                        $scope.showOptions = false;
                        $scope.isselect = true;
                    }
                }, $scope.setting);
                $scope.setting.options = $scope.setting.data.slice(0, $scope.setting.maxshow);

                $scope.data = {
                    id      : '',
                    label   : '',
                    text    : ''
                };

                $scope.isselect = false;
                $scope.isrequesting = false;
                $scope.$watch('data.text', function (newvalue, oldvalue) {
                    if (newvalue != oldvalue && !$scope.isselect && !$scope.isrequesting) {
                        $scope.isrequesting = true;
                        $scope.setting.getData(newvalue).then(function (response) {
                            $scope.setting.options = response.data;
                            $scope.showOptions = true;
                            $scope.isrequesting = false;
                            $scope.index = -1;
                        }, function (error) {
                            $log.debug(error);
                            $alert.add('Gagal mengambil data! <br/>' + error.message, $alert.danger);
                            $scope.isrequesting = false;
                        });
                    }
                    $scope.isselect = false;
                });

                $scope.$watch('dropdown', function(newvalue, oldvalue){
                    if($scope.dropdown == '' || (typeof $scope.dropdown === 'undefined')){
                        $scope.data.id = '';
                        $scope.data.label = '';
                        $scope.data.text = '';
                        $scope.isselect = true;
                    }
                });

                $scope.showOptions = false;

                $scope.focus = function(element, event){
                    $scope.index = -1;

                    $scope.showOptions = true;
                    $scope.$apply();
                };

                $scope.blur = function(element, event){
                    $scope.showOptions = false;

                    if($scope.setting.isalwaysvalid){
                        var found = false;
                        for(var i=0; i<$scope.setting.options.length; i++) if($scope.data.id != ''){
                            if($scope.setting.options[i].id == $scope.data.id && $scope.setting.options[i].label == $scope.data.text){
                                found = true;
                            }
                        }

                        if(!found){
                            $scope.data.isselect = true;
                            $scope.data.id = '';
                            $scope.data.label = '';
                            $scope.data.text = '';
                        }
                    }

                    $scope.index = -1;

                    $timeout(function(){
                        if($scope.data.label != $scope.data.text) $scope.$apply();
                    }, 150);
                };

                $scope.index = -1;
                $scope.keydown = function(element, event){
                    var isdown = false;
                    switch(event.keyCode) {
                        // up
                        case 38:
                            $scope.index -= $scope.index > 0 ? 1 : 0;
                            isdown = true;
                            break;

                        // down
                        case 40:
                            $scope.index += $scope.index < $scope.setting.options.length-1 ? 1 : 0;
                            isdown = true;
                            break;

                        // enter
                        case 13:
                            if($scope.setting.options[$scope.index]){
                                $scope.setting.select($scope.setting.options[$scope.index]);
                            }
                            isdown = true;
                            break;
                    }
                    if(isdown){
                        $scope.$apply();
                        event.preventDefault();
                    }
                };

                $timeout(function(){
                    var dropdown = angular.element(document.getElementById("dropdown" + $scope.$id)),
                        addon = angular.element(document.getElementById("addon" + $scope.$id)),
                        input = angular.element(document.getElementById("input" + $scope.$id)),
                        options = angular.element(document.getElementById("options" + $scope.$id));

                    input[0].style.width = (dropdown[0].offsetWidth - addon[0].offsetWidth - 11) + "px";
                    options[0].style.width = (dropdown[0].offsetWidth - addon[0].offsetWidth) + "px";
                });
        }]
    });
});