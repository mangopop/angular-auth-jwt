var app = angular.module('myApp', ['ngResource','ngRoute','angular-jwt']);

app.config(['$routeProvider','$locationProvider','$httpProvider','jwtInterceptorProvider', function($routeProvider,$locationProvider,$httpProvider,jwtInterceptorProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'app/partials/home.html',
        controller: 'HomeCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });


    //$httpProvider.defaults.headers.common = {};
    //$httpProvider.defaults.headers.post = {};
    //$httpProvider.defaults.headers.get = {};
    //$httpProvider.defaults.headers.put = {};
    //$httpProvider.defaults.headers.patch = {};

    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header containing XMLHttpRequest used to identify ajax call
    //that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];


    //jwtInterceptorProvider.tokenGetter = ['myService', function(myService) {
    //    myService.doSomething();
    //    return localStorage.getItem('id_token');
    //}];
    //jwtInterceptorProvider.tokenGetter = function() {
    //
    //    if(!localStorage.getItem('id_token') ){
    //        return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMWcyM2ExMmFhIn0.eyJpc3MiOiJodHRwOlwvXC9hcGkuZGV2Lm5pdHJpdGV4LmNvbSIsImF1ZCI6Imh0dHA6XC9cL2FwaS5kZXYubml0cml0ZXguY29tIiwianRpIjoiNGYxZzIzYTEyYWEiLCJpYXQiOjE0NTUyMDM0MzksIm5iZiI6MTQ1NTIwMzQ5OSwiZXhwIjoxNDU1MjA3MDM5LCJ1aWQiOjF9.iJm7T75MMAjLF3UuIJM1_XAmMIkSFUOjytU7sTUGhEw'
    //    }else{
    //        //console.log('tokenGetter '+localStorage.getItem('id_token'));
    //
    //        return localStorage.getItem('id_token');
    //    }
    //
    //};
    //jwtInterceptorProvider.tokenGetter = ['store', function (store) { return store.get('jwt'); }];
    //$httpProvider.interceptors.push('jwtInterceptor');
    //$httpProvider.interceptors.push('httpRequestInterceptor');

    ///// *** remove the hashbang *** //////
    //check browser support
    //$locationProvider.html5Mode(true); //will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">

}]).run(function($http) {
    if(localStorage.getItem('id_token')){
        $http.defaults.headers.common.Authorization = 'Bearer '+localStorage.getItem('id_token');//this will set header which is logged out in http get call
    }else{

    }

});

//app.factory('httpRequestInterceptor', ['$rootScope', function(){
//        return {
//            request: function($config) {
//                if(!localStorage.getItem('id_token') ){
//                    return null;
//                }
//
//                $config.headers.Authorization = localStorage.getItem('id_token');
//                return $config;
//            }
//        };
//    }]);

app.controller('HomeCtrl',['$scope','$routeParams','$location', '$http', function($scope,$routeParams,$location,$http) { //picky order
    //var vm = this;

    $scope.testLogin = function() {
        $http({
            method: "POST",
            url: "http://dev.api.nitritex.com/login",
            data: 'username=simon&password=pass',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' //essential for CORS
            }
        }).then(
            function (response) {
                //set token in local storage
                localStorage.setItem('id_token',response.data);
                //console.log('response: '+response.data);
                //console.log('id_token: '+localStorage.getItem('id_token'))
            },
            function (response) {
                console.log(response);
            }
        );
    };

    $scope.getSecureStuff = function(){

        $http({
            method: 'JSONP',
            url: 'http://dev.api.nitritex.com/secure',
            params: {callback:'JSON_CALLBACK'},

        }).then(
            function(response){
                console.log('success '+response.data);
                //console.dir(data);
            },
            function(response,status ){
                console.log('fail'+status);
                console.log(response);
            });

        //$http.get('http://dev.api.nitritex.com/shop/products').then(
        //    function(data){
        //        console.log('success'+data);
        //    },
        //    function(data){
        //        console.log('fail');
        //    });
    };

    $scope.jax = function() {
        $.ajax({
            type:'GET',
            // The name of the callback parameter, as specified by the YQL service
            //jsonp: "callback",
            // Tell jQuery we're expecting JSONP
            //dataType: "jsonp",
            beforeSend: function (request) {
                request.setRequestHeader("X-LOL-HEADERS", 'someData');
            },
            //url: "http://dev.api.nitritex.com/unsecure?callback=JSON_CALLBACK"
            url: "API.php"
        });
    };

    $scope.getUnsecureStuff = function(){

        $http({
            method: 'GET',
            url: 'http://dev.api.nitritex.com/unsecure',
            //params: {callback:'JSON_CALLBACK'},
            header: {
                'X-SIMON-WOZ-ERE`': 'test'
            }
        }).then(
            function(response){
                console.log('custom auth header ' +$http.defaults.headers.common.Authorization);
                console.log('success '+response.data);
                //console.dir(data);
            },
            function(response,status ){
                console.log('fail');
                //console.log(response
            });

        //$http.get('http://dev.api.nitritex.com/shop/products').then(
        //    function(data){
        //        console.log('success'+data);
        //    },
        //    function(data){
        //        console.log('fail');
        //    });
    };

    $scope.postStuff = function(){

        $http({
            method: 'POST',
            url: 'http://dev.api.nitritex.com/posting',
            //url: 'http://dev.bioclean.com/service/products.php',
            params: {user:'1',pass:'mypass'}
        }).then(
            function(data){
                console.log('success');
                console.dir(data);
            },
            function(data,status ){
                console.log('fail ' );
                console.log(data);
            });

        //$http.get('http://dev.api.nitritex.com/shop/products').then(
        //    function(data){
        //        console.log('success'+data);
        //    },
        //    function(data){
        //        console.log('fail');
        //    });
    };

    //var authData = 'Basic '+ $window.btoa(unescape(encodeURIComponent(param))).encode('simon') + ':' + base64Service.encode('pa55word');
    //console.log(authData);

    //$scope.testGenerateAuthorizationHeader = function() {
    //    console.log(basicAuthService.generateAuthorizationHeader('simon', 'pa55word')); // return 'Basic am9obg==:dGhpcyBpcyBteSBwYXNzd29yZA=='
    //};

    //$scope.testLogin = function() {
    //    var authData = {username: 'simon', password: 'password'};
    //
    //    var successCB = function(response) {
    //        console.log(response);
    //        // Work with extra data coming from the remote server
    //        //$scope.generatedKey = response.data.generatedKey; //there is nothing coming back, so use root response
    //        $scope.generatedKey = response;
    //    };
    //
    //    var failureCB = function(error) {
    //        $scope.status = 'ERROR';
    //    };
    //
    //    basicAuthService.login('http://dev.api.nitritex.com/loginfree', authData, successCB, failureCB);
    //};



}]);