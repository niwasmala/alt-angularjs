define([
], function(){
    return alt.component({
        name: 'altTooltip',
        templateUrl: 'component/alt/tooltip/view.html',
        transclude: true,
        scope: {
            isshow: '=?',
            placement: '=?',
            altTooltip: '=?'
        },
        link: ['$scope', '$log', '$compile', '$timeout', '$element', function($scope, $log, $compile, $timeout, $element){
            var findByAttr = function(element, attr){
                    if(element == null || typeof element === 'undefined'){
                        return null;
                    }else if(element.attr(attr) || element.attr('data-' + attr) || element.hasClass(attr)){
                        return element;
                    }else if(element.children().length > 0){
                        for(var i=0; i<element.children().length; i++){
                            var el = findByAttr(angular.element(element.children()[i]), attr);
                            if(el!= null) return el;
                        }
                    }else{
                        return null;
                    }
                },
                tooltip = findByAttr($element, 'tooltip fade'),
                arrow = findByAttr($element, 'tooltip-arrow'),
                container = angular.element(findByAttr($element, 'ng-transclude').children()[0]);

            $scope.placement = $scope.placement || 'top';
            $scope.altTooltip = $scope.altTooltip || 'Tes';
            $scope.top = 0;
            $scope.left = 0;
            $scope.isshow = true;

            $timeout(function(){
                var t_bound = tooltip[0].getBoundingClientRect(),
                    t_width = t_bound.right && t_bound.left ? Math.abs(t_bound.right - t_bound.left) : tooltip.prop('offsetWidth'),
                    t_height = t_bound.top && t_bound.bottom ? Math.abs(t_bound.top - t_bound.bottom) : tooltip.prop('offsetHeight'),
                    c_bound = container[0].getBoundingClientRect(),
                    c_width = c_bound.right && c_bound.left ? Math.abs(c_bound.right - c_bound.left) : container.prop('offsetWidth'),
                    c_height = c_bound.top && c_bound.bottom ? Math.abs(c_bound.top - c_bound.bottom) : container.prop('offsetHeight'),
                    c_left = c_bound.left || container.prop('offsetLeft'),
                    c_top = c_bound.top || container.prop('offsetTop');

                $scope.left = c_left - (t_width - c_width) / 2;

                switch($scope.placement){
                    case 'top':
                    default:
                        $scope.top = c_top - t_height;
                        $scope.left = c_left - (t_width - c_width) / 2;
                        $scope.bottom_arrow = -5;
                        break;
                    case 'bottom':
                        $scope.top = c_top + t_height;
                        $scope.left = c_left - (t_width - c_width) / 2;
                        $scope.top_arrow = -5;
                        break;
                    case 'left':
                        $scope.top = c_top + ((c_height - t_height) / 2);
                        $scope.left = c_left - t_width - 5;
                        $scope.right_arrow = -5;
                        break;
                    case 'right':
                        $scope.top = c_top + ((c_height - t_height) / 2);
                        $scope.left = c_left + c_width + 5;
                        $scope.left_arrow = -5;
                        break;
                }

                $scope.isshow = false;
            });

            container.bind('mouseover mouseenter', function(event){
                $scope.$apply(function(){
                    $scope.isshow = true;
                });
            });

            container.bind('mouseout mouseleave', function(event){
                $scope.$apply(function(){
                    $scope.isshow = false;
                });
            });
        }]
    });
});