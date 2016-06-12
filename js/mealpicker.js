/* Hello, this is Dinner Time */

app = angular.module('mealpickerApp', []);

app.controller('mealCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.tags = [ ];
    $scope.recipes = {};
    $scope.selectedTags = {};
    $scope.selectedRecipes = {};

    $scope.toggleTag = function(tag) {
        $scope.selectedRecipes = {};
        for (var recipe in $scope.recipes) {
            var tagCount = 0;
            var tagMatchCount = 0;
            for (var tag in $scope.selectedTags) {
                if ($scope.selectedTags[tag] == false) continue;
                tagCount++;
                if ($scope.recipes[recipe].indexOf(tag) > -1) tagMatchCount++;
            }
            if (tagMatchCount == tagCount) $scope.selectedRecipes[recipe] = $scope.recipes[recipe];
        }
    }

    $scope.count = function(tag) {
        var count = 0;
        angular.forEach($scope.recipes, function(r) {
            for (var t in r) {
                if (r[t] == tag) count++;
            }
        });
        return count;
    }

    $scope.loadRecipes = function() {
        $http.get("list.json").then(function (response) {
            var tags = {};
            $scope.recipes = response.data;
            $scope.selectedRecipes = response.data;
            for (recipe in response.data) {
                for (tag in response.data[recipe]) {
                    tags[response.data[recipe][tag]] = 1;
                }
            }
            $scope.tags = Object.keys(tags).sort();
        },
        function(response) {
            console.log("Failed to read list of recipes: ", response.message);
        });
    }

    $scope.tagCount = function() {
        var count = 0;
        angular.forEach($scope.selectedTags, function (t,v) {
            if ($scope.selectedTags[v] == true) count++;
        });
        return count;
    }

    $scope.recipeCount = function() {
        return $scope.selectedRecipes.length;
    }


    $scope.loadRecipes();

}]);


app.filter('searchFilter', function() {
    return function(input, search) {
        if (!search) return input;
        if (!input) return input;
        var expected = ('' + search).toLowerCase();
        var result = {};
        angular.forEach(input, function(value, key) {
            if (key.toLowerCase().indexOf(search) > -1) result[key] = value;
        });
        return result;
        
      //return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
