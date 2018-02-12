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