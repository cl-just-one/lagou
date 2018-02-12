'use strict';

angular.module('app').controller('companyCtrl', ['$q', '$http', '$state', '$scope', 
    function ($q, $http, $state, $scope) {
        $http.get('/data/company.json?'+$state.params.id).success(function(resp){
            $scope.company = resp;
            $scope.$broadcast('abc', {id: 1});
        });
        $scope.$on('cba', function(event, data) {
            console.log(event, data);
        });
    }
]);