define([
    'component/alt/button/controller'
], function(){
    return alt.component({
        name: 'altModal',
        templateUrl: 'component/alt/modal/view.html',
        transclude: true,
        scope: {
            modal: '=?altModal'
        },
        link: ['$scope', '$log', '$button', function($scope, $log, $button){
            $scope.modal = alt.extend({
                type: 'warning',
                isshow: false,
                open: function(){
                    $scope.modal.isshow = true;
                },
                close: function(){
                    $scope.modal.isshow = false;
                },
                buttons: [
                    $button('close', {
                        onclick: function(){
                            $scope.altModal.close();
                        }
                    })
                ]
            }, $scope.modal);
        }]
    });
});