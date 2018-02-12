'use strict';

angular.module('app').directive('appPositionClass', [function () {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionClass.html',
        scope: {
            com: "="
        },
        link: function(scope) {
            scope.isActive = 0;
            scope.showPositionList = function(idx) {
                scope.positionList = scope.com.positionClass[idx].positionList;
                scope.isActive = idx;
            }
            scope.$watch('com', function(nv) {
                if(nv) {
                    scope.showPositionList(0);
                }
            });
        }
    }
}]);