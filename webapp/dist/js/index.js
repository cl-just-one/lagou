"use strict";angular.module("app",["ui.router","ngCookies","validation","ngAnimate"]),angular.module("app").value("dict",{}).run(["$http","dict",function(t,e){t.get("/data/city.json").success(function(t){e.city=t}),t.get("/data/salary.json").success(function(t){e.salary=t}),t.get("/data/scale.json").success(function(t){e.scale=t})}]),angular.module("app").config(["$provide",function(t){t.decorator("$http",["$delegate","$q",function(t,e){return t.post=function(n,o,a){var i=e.defer();return t.get(n).success(function(t){i.resolve(t)}).error(function(t){i.reject(t)}),{success:function(t){i.promise.then(t)},error:function(t){i.promise.then(null,t)}}},t}])}]),angular.module("app").config(["$stateProvider","$urlRouterProvider",function(t,e){t.state("main",{url:"/main",templateUrl:"/view/main.html",controller:"mainCtrl"}).state("position",{url:"/postion/:id",templateUrl:"/view/position.html",controller:"positionCtrl"}).state("company",{url:"/company/:id",templateUrl:"/view/company.html",controller:"companyCtrl"}).state("search",{url:"/search",templateUrl:"/view/search.html",controller:"searchCtrl"}).state("login",{url:"/login",templateUrl:"/view/login.html",controller:"loginCtrl"}).state("register",{url:"/register",templateUrl:"/view/register.html",controller:"registerCtrl"}).state("me",{url:"/me",templateUrl:"/view/me.html",controller:"meCtrl"}).state("post",{url:"/post",templateUrl:"/view/post.html",controller:"postCtrl"}).state("favorite",{url:"/favorite",templateUrl:"/view/favorite.html",controller:"favoriteCtrl"}),e.otherwise("main")}]),angular.module("app").config(["$validationProvider",function(t){t.setExpression({phone:/^1[\d]{10}/,password:function(t){return(t+"").length>5},required:function(t){return!!t}}).setDefaultMsg({phone:{success:"",error:"手机号码11位"},password:{success:"",error:"密码至少六位"},required:{success:"",error:"不能为空"}})}]),angular.module("app").controller("companyCtrl",["$q","$http","$state","$scope",function(t,e,n,o){e.get("/data/company.json?"+n.params.id).success(function(t){o.company=t,o.$broadcast("abc",{id:1})}),o.$on("cba",function(t,e){console.log(t,e)})}]),angular.module("app").controller("favoriteCtrl",["$http","$scope",function(t,e){t.get("data/myFavorite.json").success(function(t){e.list=t})}]),angular.module("app").controller("loginCtrl",["cache","$state","$http","$scope",function(t,e,n,o){o.submit=function(){console.log("1"),n.post("data/login.json",o.user).success(function(n){t.put("id",n.id),t.put("name",n.name),t.put("image",n.image),e.go("main")})}}]),angular.module("app").controller("mainCtrl",["$http","$scope",function(t,e){t.get("/data/positionList.json").success(function(t){e.list=t})}]),angular.module("app").controller("meCtrl",["cache","$state","$http","$scope",function(t,e,n,o){o.name=t.get("name"),o.image=t.get("image"),o.logout=function(){t.get("name")&&(t.remove("id"),t.remove("name"),t.remove("image"),e.go("main"))}}]),angular.module("app").controller("positionCtrl",["$log","$q","$http","$state","$scope","cache",function(t,e,n,o,a,i){var s;a.isLogin=!!i.get("name"),a.message=a.isLogin?"投递简历":"去登陆",(s=e.defer(),n.get("/data/position.json?"+o.params.id).success(function(t){a.position=t,s.resolve(t)}).error(function(t){s.reject(t)}),s.promise).then(function(t){var e;e=t.companyId,n.get("/data/company.json?"+e).success(function(t){a.company=t})}),a.go=function(){" 已投递"!==a.message&&(a.isLogin?n.post("data/handle.json",{id:a.company.id}).success(function(e){t.info(e),a.message=" 已投递"}):o.go("login"))}}]),angular.module("app").controller("postCtrl",["$http","$scope",function(t,e){e.tabList=[{id:"all",name:"全部"},{id:"pass",name:"邀请面试"},{id:"fail",name:"不合适"}],t.get("data/myPost.json").success(function(t){e.positionList=t}),e.filterObj={},e.tClick=function(t,n){switch(t){case"all":delete e.filterObj.state;break;case"pass":e.filterObj.state="1";break;case"fail":e.filterObj.state="-1"}}}]),angular.module("app").controller("registerCtrl",["$interval","$http","$scope",function(t,e,n){n.submit=function(){e.post("data/regist.json",n.user,function(t){})};var o=60;n.send=function(){e.get("data/code.json").success(function(e){if(1===e.state){o=60,n.time="60s";var a=t(function(){if(o<=0)return t.cancel(a),void(n.time="");o--,n.time=o+"s"},1e3)}})}}]),angular.module("app").controller("searchCtrl",["$http","$scope","dict",function(t,e,n){e.name="",e.search=function(){t.get("/data/positionList.json?name="+e.name).success(function(t){e.positionList=t})},e.search(),e.sheet={},e.tabList=[{id:"city",name:"城市"},{id:"salary",name:"薪水"},{id:"scale",name:"公司规模"}];var o="";e.tClick=function(t,a){o=t,e.sheet.list=n[t],e.sheet.visible=!0},e.sClick=function(t,n){t?angular.forEach(e.tabList,function(t){t.id===o&&(t.name=n)}):angular.forEach(e.tabList,function(t){if(t.id===o)switch(t.id){case"city":t.name="城市";break;case"salary":t.name="薪水";break;case"scale":t.name="公司规模"}})}}]),angular.module("app").directive("appCompany",[function(){return{restrict:"A",replace:!0,templateUrl:"view/template/company.html",scope:{com:"="}}}]),angular.module("app").directive("appFoot",[function(){return{restrict:"A",replace:!0,templateUrl:"view/template/foot.html"}}]),angular.module("app").directive("appHead",["cache",function(t){return{restrict:"A",replace:!0,templateUrl:"view/template/head.html",link:function(e){e.name=t.get("name")}}}]),angular.module("app").directive("appHeadBar",[function(){return{restrict:"A",replace:!0,templateUrl:"view/template/headBar.html",scope:{text:"@"},link:function(t){t.back=function(){window.history.back()},t.$on("abc",function(t,e){console.log(t,e)}),t.$emit("cba",{name:"huahua"})}}}]),angular.module("app").directive("appPositionClass",[function(){return{restrict:"A",replace:!0,templateUrl:"view/template/positionClass.html",scope:{com:"="},link:function(t){t.isActive=0,t.showPositionList=function(e){t.positionList=t.com.positionClass[e].positionList,t.isActive=e},t.$watch("com",function(e){e&&t.showPositionList(0)})}}}]),angular.module("app").directive("appPositionInfo",["$http",function(t){return{restrict:"A",replace:!0,templateUrl:"view/template/positionInfo.html",scope:{isActive:"=",isLogin:"=",pos:"="},link:function(e){e.$watch("pos",function(t){t&&(e.pos.select=e.pos.select||!1,e.imgePath=e.pos.select?"/image/star-active.png":"/image/star.png")}),e.favorite=function(){t.post("data/favorite.json",{id:e.pos.id,select:!e.pos.select}).success(function(t){e.pos.select=!e.pos.select,e.imgePath=e.pos.select?"/image/star-active.png":"/image/star.png"})}}}}]),angular.module("app").directive("appPositionList",["$http",function(t){return{restrict:"A",replace:!0,templateUrl:"view/template/positionList.html",scope:{data:"=",filterObj:"=",isFavorite:"="},link:function(e){e.select=function(e,n){e.stopPropagation(),t.post("data/favorite.json",{id:n.id,select:!n.select}).success(function(t){n.select=!n.select})}}}}]),angular.module("app").directive("appSheet",[function(){return{restrict:"A",replace:!0,scope:{list:"=",visible:"=",select:"&"},templateUrl:"/view/template/sheet.html"}}]),angular.module("app").directive("appTab",[function(){return{restrict:"A",replace:!0,scope:{list:"=",tabClick:"&"},templateUrl:"/view/template/tab.html",link:function(t){t.click=function(e){t.selectId=e.id,t.tabClick(e)}}}}]),angular.module("app").factory("cache",["$cookies",function(t){return{put:function(e,n){t.put(e,n)},get:function(e){return t.get(e)},remove:function(e){t.remove(e)}}}]);