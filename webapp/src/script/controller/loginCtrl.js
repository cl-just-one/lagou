'use strict';

angular.module('app')
.controller('loginCtrl', ['cache', '$state', '$http', '$scope', 
    function (cache, $state, $http, $scope) {
        $scope.submit = function() {
            console.log('1');
            $http.post('data/login.json', $scope.user).success(function(resp){
                cache.put('id', resp.id);
                cache.put('name', resp.name);
                cache.put('image', resp.image);
                $state.go('main');
            })
        };
}]);