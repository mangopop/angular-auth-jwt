var app = angular.module('myApp', ['ngResource','ngRoute','angular-jwt']);

app.config(['$routeProvider','$locationProvider','$httpProvider', function($routeProvider,$locationProvider,$httpProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'app/partials/home.html',
        controller: 'HomeCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });

    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header containing XMLHttpRequest used to identify ajax call
    //that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    ///// *** remove the hashbang *** //////
    //check browser support
    //$locationProvider.html5Mode(true); //will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">

}]);


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
                console.log(response);
            },
            function (response) {
                console.log(response);
            }
        );
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

    $scope.postStuff = function(){

        $http({
            method: 'JSONP',
            url: 'http://dev.api.nitritex.com/post',
            //url: 'http://dev.bioclean.com/service/products.php',
            params: {data:'123', callback:'JSON_CALLBACK'}
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

    $scope.getStuff = function(){

        $http({
            method: 'JSONP',
            url: 'http://dev.api.nitritex.com/products/category',
            //url: 'http://dev.bioclean.com/service/products.php',
            params: {callback:'JSON_CALLBACK'}
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
}]);