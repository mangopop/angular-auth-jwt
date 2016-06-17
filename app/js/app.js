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

    //this does work, check config.header object
    // jwtInterceptorProvider.tokenGetter = function() {
    //
    //     if(!localStorage.getItem('id_token') ){
    //         return null
    //     }else{
    //         console.log('tokenGetter '+localStorage.getItem('id_token'));
    //
    //         return localStorage.getItem('id_token');
    //     }
    //
    // };
    //jwtInterceptorProvider.tokenGetter = ['store', function (store) { return store.get('jwt'); }];
    // $httpProvider.interceptors.push('jwtInterceptor');
    //$httpProvider.interceptors.push('httpRequestInterceptor');

    ///// *** remove the hashbang *** //////
    //check browser support
    //$locationProvider.html5Mode(true); //will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">

}]).run(function($http) {
    if(localStorage.getItem('id_token')){
        $http.defaults.headers.common.Authorization = 'Bearer '+localStorage.getItem('id_token');//this will set header which is logged out in http get call
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

/*
 OK so further knowledge gained on this, setting custom headers with JS kicks of a preflight request using `OPTIONS` JQuery explicitly avoids setting customer headers to avoid this problem,
 it seem that angular doesn't . So it's something that has to be dealt with, if you are setting your own headers or not.
 What you have to do is accept `options` in your backend (I'm using silex) then return a response saying 'ok fine if you must insist with this circus act'
 and then angular will make another request with `POST ` with the correct header and everyone can go home and relax. So it's working all nice and secure with JSON web token keys signed and validated by date in auth header.
 effort.
 */

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
            method: 'GET', //switched this FROM JSONP to GET and saw the Auth header, and got the Auth working on the other end (but hasn't tested if I can get content out)
            url: 'http://dev.api.nitritex.com/secure'
            // params: {callback:'JSON_CALLBACK'}

        }).then(
            function(response){
                console.log('success '+response.data);
                //console.dir(data);
            },
            function(response){
                console.log('fail');
                console.log(response);
                //this isn't getting to silex, can be JSONP (doesn't allow setting headers) or the OPTIONS pre-flight situation
                console.log('custom auth header ' +$http.defaults.headers.common.Authorization); //using interceptor this isn't set
            });
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
            params: {callback:'JSON_CALLBACK'},
            header: {
                'X-SIMON-WOZ-ERE`': 'test'
            }
        }).then(
            function(response){
                console.log('custom auth header ' +$http.defaults.headers.common.Authorization);
                console.log('success '+response.data);
                //console.dir(data);
            },
            function(){
                console.log('fail');
            });
    };

    $scope.postStuff = function(){

        $http({
            method: 'POST',
            url: 'http://dev.api.nitritex.com/posting',
            //url: 'http://dev.bioclean.com/service/products.php',
            params: {user:'simon',pass:'pass'}
        }).then(
            function(data){
                console.log('success');
                console.dir(data);
            },
            function(data,status ){
                console.log('fail ' );
                console.log(data);
            });
    };
}]);