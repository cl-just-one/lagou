'use strict';

angular.module('app', ['ui.router', 'ngCookies', 'validation', 'ngAnimate']);
'use strict';

angular.module('app').value('dict', {})
    .run(['$http', 'dict', function($http, dict) {
        $http.get('/data/city.json').success(function(resp) {
            dict.city = resp;
        });

        $http.get('/data/salary.json').success(function(resp) {
            dict.salary = resp;
        });

        $http.get('/data/scale.json').success(function(resp) {
            dict.scale = resp;
        });
    }]);
'use strict';

angular.module('app').config(['$provide', 
    function($provide){
        $provide.decorator('$http', ['$delegate', '$q',
            function($delegate, $q) {
                $delegate.post = function(url, data, config) {
                    var def = $q.defer();
                    $delegate.get(url).success(function(resp) {
                        def.resolve(resp);
                    }).error(function(err) {
                        def.reject(err);
                    });
                    return {
                        success: function(cb) {
                            def.promise.then(cb);
                        },
                        error: function(cb) {
                            def.promise.then(null, cb);
                        }
                    }
                }
            return $delegate;
        }]);
    }]);
'use strict';

angular.module('app').config(['$stateProvider', '$urlRouterProvider', 
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('main', {
            url: '/main',
            templateUrl: '/view/main.html',
            controller: 'mainCtrl'
        }).state('position', {
            url: '/postion/:id',
            templateUrl: '/view/position.html',
            controller: 'positionCtrl'
        }).state('company', {
            url: '/company/:id',
            templateUrl: '/view/company.html',
            controller: 'companyCtrl'
        }).state('search', {
            url: '/search',
            templateUrl: '/view/search.html',
            controller: 'searchCtrl'
        }).state('login', {
            url: '/login',
            templateUrl: '/view/login.html',
            controller: 'loginCtrl'
        }).state('register', {
            url: '/register',
            templateUrl: '/view/register.html',
            controller: 'registerCtrl'
        }).state('me', {
            url: '/me',
            templateUrl: '/view/me.html',
            controller: 'meCtrl'
        }).state('post', {
            url: '/post',
            templateUrl: '/view/post.html',
            controller: 'postCtrl'
        }).state('favorite', {
            url: '/favorite',
            templateUrl: '/view/favorite.html',
            controller: 'favoriteCtrl'
        });
        $urlRouterProvider.otherwise('main');
    }]);
'use strict'

angular.module("app").config(['$validationProvider', 
    function($validationProvider) {
        var expression = {
            phone: /^1[\d]{10}/,
            password: function(value) {
                var str = value+'';
                return str.length > 5;
            },
            required: function(value) {
                return !!value;
            }
        };
        var defaultMsg = {
            phone: {
                success: "",
                error: "手机号码11位"
            },
            password: {
                success: "",
                error: "密码至少六位"
            },
            required: {
                success: "",
                error: "不能为空"
            }
        };
        $validationProvider
        .setExpression(expression)
        .setDefaultMsg(defaultMsg);
}]);
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
'use strict';

angular.module('app')
.controller('favoriteCtrl', ['$http', '$scope', 
    function ($http, $scope) {
        $http.get('data/myFavorite.json').success(function(resp){
            $scope.list = resp;
        });
}]);
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
'use strict';

angular.module('app').controller('mainCtrl', ['$http', '$scope', function ($http, $scope) {
   $http.get('/data/positionList.json').success(function (resq) {
        $scope.list = resq;
   });
}]);
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
'use strict';

angular.module('app').controller('positionCtrl', 
    ['$log', '$q', '$http', '$state', '$scope', 'cache',
    function ($log, $q, $http, $state, $scope, cache) {
        $scope.isLogin = cache.get('name')?true:false;
        $scope.message = $scope.isLogin?'投递简历':'去登陆';
        function getPosition () {
            var def = $q.defer();
            $http.get('/data/position.json?'+$state.params.id).success(function(resp){
                $scope.position = resp;
                def.resolve(resp);
            }).error(function(err) {
                def.reject(err);
            });
            return def.promise;
        };
        function getCompany (id) {
            $http.get('/data/company.json?'+id).success(function(resp){
                $scope.company = resp;
            });
        };
        getPosition().then(function(obj){
            getCompany(obj.companyId);
        });
        $scope.go = function () {
            if ($scope.message !== " 已投递") {
                if ($scope.isLogin) {
                    $http.post('data/handle.json', {
                        id: $scope.company.id
                    }).success(function(resp){
                        $log.info(resp);
                        $scope.message = " 已投递";
                    })
                } else {
                    $state.go('login');
                }
            }
        };
    }
]);
'use strict';

angular.module('app')
.controller('postCtrl', ['$http', '$scope', 
    function ($http, $scope) {
        $scope.tabList = [{
            id: "all",
            name: "全部"
        }, {
            id:"pass",
            name: "邀请面试"
        }, {
            id: "fail",
            name: "不合适"
        }];
        $http.get('data/myPost.json').success(function(resp){
            $scope.positionList = resp;
        });
        $scope.filterObj = {};
        $scope.tClick = function (id, name) {
            switch(id) {
                case 'all':
                    delete $scope.filterObj.state;
                    break;
                case 'pass':
                    $scope.filterObj.state = '1';
                    break;
                case 'fail':
                    $scope.filterObj.state = '-1';
                    break;
                default:
            }
        };
}]);
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
'use strict';

angular.module('app').controller('searchCtrl', ['$http', '$scope', 'dict',
    function ($http, $scope, dict) {
    $scope.name = '';

    $scope.search = function () {
        $http.get('/data/positionList.json?name='+$scope.name).success(function (resq) {
            $scope.positionList = resq;
        });
    };
    $scope.search();
    $scope.sheet = {};
    $scope.tabList = [
        {
            id: "city",
            name: "城市"
        },
        {
            id: "salary",
            name: "薪水"
        },
        {
            id: "scale",
            name: "公司规模"
        }
    ];

    var tabId = '';
    $scope.tClick = function (id, name) {
        tabId = id;
        $scope.sheet.list = dict[id];
        $scope.sheet.visible = true;
    };
    $scope.sClick = function (id, name) {
        if (id) {
            angular.forEach($scope.tabList,
                function(item){
                    if (item.id === tabId) {
                        item.name = name;
                    }
                });
        } else {
            angular.forEach($scope.tabList,
                function(item){
                    if (item.id === tabId) {
                        switch (item.id) {
                            case 'city':
                                item.name = '城市';
                                break;
                            case 'salary':
                                item.name = '薪水';
                                break;
                            case 'scale':
                                item.name = '公司规模';
                                break;
                            default:
                                break;
                        }
                    }
                });
        }
    };
}]);
'use strict';

angular.module('app').directive('appCompany', [function () {
    return {
        restrict: "A",
        replace: true,
        templateUrl: 'view/template/company.html',
        scope: {
            com: "="
        }
    }
}]);
'use strict';

angular.module('app').directive('appFoot', [function () {
    return {
        restrict: "A",
        replace: true,
        templateUrl: 'view/template/foot.html'
    }
}]);
'use strict';

angular.module('app').directive('appHead', ['cache',function (cache) {
    return {
        restrict: "A",
        replace: true,
        templateUrl: "view/template/head.html",
        link: function($scope) {
            $scope.name = cache.get('name');
        }
    }
}]);
'use strict';

angular.module('app').directive('appHeadBar', [function () {
    return {
        restrict: "A",
        replace: true,
        templateUrl: "view/template/headBar.html",
        scope: {
            text: "@"
        },
        link: function(scope) {
            scope.back = function() {
                window.history.back();
            };
            scope.$on('abc', function(event, data) {
                console.log(event, data);
            });
            scope.$emit('cba', {name: 'huahua'});
        }
    }
}]);
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
'use strict';

angular.module('app').directive('appPositionInfo', ['$http', function ($http) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionInfo.html',
        scope: {
            isActive: "=",
            isLogin: "=",
            pos: "="
        },
        link: function($scope) {
            $scope.$watch('pos',function(newVal){
                if (newVal) {
                    $scope.pos.select = $scope.pos.select || false;
                    $scope.imgePath = $scope.pos.select?'/image/star-active.png':'/image/star.png';
                }
            });
            $scope.favorite = function () {
                $http.post('data/favorite.json', {
                    id: $scope.pos.id,
                    select: !$scope.pos.select
                }).success(function(resp){
                    $scope.pos.select = !$scope.pos.select;
                    $scope.imgePath = $scope.pos.select?'/image/star-active.png':'/image/star.png';
                })
            };
        }
    }
}]);
'use strict';

angular.module('app').directive('appPositionList', ['$http', function ($http) {
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'view/template/positionList.html',
        scope: {
            data: "=",
            filterObj: "=",
            isFavorite: "="
        },
        link: function($scope){
            $scope.select = function(e, item) {
                e.stopPropagation();
                $http.post('data/favorite.json', {
                    id: item.id,
                    select: !item.select
                }).success(function(resp) {
                    item.select = !item.select;
                })
            };
        }
    }
}]);
'use strict';

angular.module('app').directive('appSheet', [function(){
    return {
        restrict: 'A',
        replace: true,
        scope: {
            list: "=",
            visible: "=",
            select: "&"
        },
        templateUrl: '/view/template/sheet.html'
    }
}]);
'use strict';

angular.module('app').directive('appTab', [function(){
    return {
        restrict: 'A',
        replace: true,
        scope: {
            list: "=",
            tabClick: "&"
        },
        templateUrl: '/view/template/tab.html',
        link: function($scope) {
            $scope.click = function (tab) {
                $scope.selectId = tab.id;
                $scope.tabClick(tab);
            };
        }
    }
}]);
'use strict';

angular.module('app')
// .service('cache', ['$cookies', function ($cookies) {
//     this.put = function (key, value) {
//         $cookies.put(key, value);
//     };
//     this.get = function (key) {
//         return $cookies.get(key);
//     };
//     this.remove = function (key) {
//         $cookies.remove(key);
//     };
// }]);
.factory('cache', ['$cookies', function ($cookies) {
    return {
        put: function (key, value) {
            $cookies.put(key, value);
        },
        get: function (key) {
            return $cookies.get(key);
        },
        remove: function (key) {
            $cookies.remove(key);
        }
    }
}]);