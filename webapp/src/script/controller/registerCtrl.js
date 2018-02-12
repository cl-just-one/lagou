'use strict';

angular.module('app')
.controller('registerCtrl', ['$interval', '$http', '$scope', 
function ($interval, $http, $scope) {
   $scope.submit = function () {
        $http.post('data/regist.json', $scope.user, function(resp){
            
        });
   };
   var count = 60;
   $scope.send = function() {
    $http.get('data/code.json').success(function(resp){
        if (1===resp.state) {
            count = 60;
            $scope.time = "60s";
            var interval = $interval(function(){
                if (count <=0 ){
                    $interval.cancel(interval);
                    $scope.time = "";
                    return;
                } else {
                    count--;
                    $scope.time = count+'s';
                }
            }, 1000);
        }
    });
   };
}]);