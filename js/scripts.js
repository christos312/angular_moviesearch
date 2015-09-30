var movieApp = angular.module('movieApp', ['ngResource', 'ngRoute', 'ngAnimate']);
    
/*movieApp.config(['$httpProvider', function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
    $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
    $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    $httpProvider.defaults.useXDomain = true;
}]);*/


movieApp.controller("IndexController", function($scope, $timeout, MovieService){
    $scope.searchTerm = "";
    $scope.movies = "";
    $scope.loading = false;
    $scope.firstRun = true;
    $scope.validation = "";

    $scope.search = function(){
        if($scope.searchTerm.length<=0){
            $scope.validation = "has-error";
            return;
        }else{
            $scope.validation = "";
        }
        if($scope.searchTerm.length > 2) { //start searching after we have more than 2 characters
            $scope.loading = true;
            $timeout(fetchMovies, 500); //to avoid too many requests to RottenTomato API while typing

        }

    }
    function fetchMovies(){

        $scope.firstRun = false;
        $scope.noResults = false;
        MovieService
        .fetchMovies($scope.searchTerm)
        .then(function (d) {
            if (d.status == 200) {
                $scope.movies = d;
            } else {
                $scope.noResults = true;
            }
        })
        .finally(function () {
            if ($scope.movies.length <= 0 || $scope.movies.data.total == 0) {
                $scope.noResults = true;
            }
            $scope.loading = false;
        })
    }

});

/*
MovieService will always return a JSON Object that included the result and the data
 */
movieApp.service('MovieService', function($http){

    var response = "";

    this.fetchMovies = function(searchTerm){
        var apiLink = "http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=bdp27bzjvatfyx3theu435q7&q=" + searchTerm + "&page_limit=3&callback=JSON_CALLBACK";
        var promise = $http.jsonp(apiLink)
                .success(function(data, status){
                    if(status == 200){
                       return {"result" : status, "data" : data.movies};
                        //console.log(data);
                    }else{
                        return {"result" : status, "data" : null};
                    }
                })
                .error(function(status){
                    return {"result" : status, "data" : null};
                });


        return promise;
    };


})