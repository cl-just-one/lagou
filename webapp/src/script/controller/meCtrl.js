'use strict';

angular.module('app')
.controller('meCtrl', ['cache', '$state', '$http', '$scope', 
    function (cache, $state, $http, $scope) {
       $scope.name = cache.get('name');
       $scope.image = cache.get('image');

       $scope.logout = function() {
           if (cache.get('name')) {
               cache.remove('id');
               cache.remove('name');
               cache.remove('image');
               $state.go('main');
           }
       };
}]);