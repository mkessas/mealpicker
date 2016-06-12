app = angular.module('mealpickerApp', []);

app.controller('mealCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.tags = [ ];
    $scope.recipes = {};

    $scope.getRecipes = function() {
        $http.get("list.json").then(function (response) {
            var tags = {};
            $scope.recipes = response.data;
            for (recipe in response.data) {
                for (tag in response.data[recipe]) {
                    tags[response.data[recipe][tag]] = 1;
                }
            }
            console.log(tags);
            $scope.tags = Object.keys(tags).sort();
        },
        function(response) {
            console.log("Failed to read list of recipes: ", response.message);
        });
    }

    $scope.getRecipes();

}]);
