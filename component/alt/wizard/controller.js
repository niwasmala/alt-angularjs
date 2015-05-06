define([
    'component/alt/wizard/step/controller',
    'component/alt/button/controller'
], function(){
    return alt.component({
        name: 'altWizard',
        templateUrl: 'component/alt/wizard/view.html',
        transclude: true,
        scope: {
            wizard: '=?altWizard'
        },
        controller: ['$scope', '$button', '$log', '$q', function($scope, $button, $log, $q) {
            var steps = $scope.steps = [];

            $scope.currentStep = 0;
            $scope.show = function(stepid){
                angular.forEach(steps, function(step) {
                    step.selected = false;
                });

                steps[stepid].selected = true;
                steps[stepid].showed = true;
                $scope.currentStep = stepid;
            };
            $scope.select = function(stepid){
                var deferred = $q.defer();

                if(steps[$scope.currentStep]){
                    if(stepid > $scope.currentStep){
                        steps[$scope.currentStep].save().then(function(){
                            steps[$scope.currentStep].finished = true;
                            $scope.show(stepid);
                            deferred.resolve();
                        }, function(){
                            deferred.reject();
                        });
                    }else{
                        $scope.show(stepid);
                        deferred.resolve();
                    }
                }else{
                    deferred.reject();
                }

                return deferred.promise;
            };
            $scope.next = function() {
                return $scope.select($scope.currentStep+1);
            };
            $scope.prev = function(){
                return $scope.select($scope.currentStep-1);
            };
            $scope.click = function(stepid, step){
                if(step.finished || step.showed){
                    $scope.select(stepid);
                }
            };

            // button
            $scope.btnnext = $button('next');
            $scope.btnnext.onclick = $scope.next;

            $scope.btnprev = $button('prev');
            $scope.btnprev.onclick = $scope.prev;

            $scope.btnstart = $button('start');
            $scope.btnstart.onclick = $scope.next;

            $scope.btnfinish = $button('finish');
            $scope.btnfinish.onclick = $scope.next;

            this.add = function(step) {
                step.show = typeof step.show !== 'undefined' ? step.show : true;
                step.showed = typeof step.showed !== 'undefined' ? step.showed : false;
                step.finished = typeof step.finished !== 'undefined' ? step.finished : false;
                step.button = typeof step.button !== 'undefined' ? step.button : true;
                step.buttonstart = typeof step.buttonstart !== 'undefined' ? step.buttonstart : true;
                step.buttonfinish = typeof step.buttonfinish !== 'undefined' ? step.buttonfinish : true;

                if(step.show){
                    steps.push(step);
                    if (steps.length === 1){
                        step.selected = true;
                    }
                }
            };

            $scope.wizard = alt.extend({
                button: true,
                next: $scope.next,
                prev: $scope.prev,
                btnnext: $scope.btnnext,
                btnprev: $scope.btnprev,
                btnstart: $scope.btnstart,
                btnsfinish: $scope.btnfinish
            }, $scope.wizard);
        }]
    });
});