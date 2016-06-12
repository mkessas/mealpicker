app = angular.module('mealpickerApp', []);

app.controller('mealCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
    $scope.tags = [];
    $scope.recipes = [];
    $scope.selectedTags = {};
    $scope.selectedRecipes = [];

    $scope.toggleTag = function(tag) {
        $scope.selectedRecipes = [];
        for (var recipe in $scope.recipes) {
            var tagCount = 0;
            var tagMatchCount = 0;
            for (var tag in $scope.selectedTags) {
                if ($scope.selectedTags[tag] == false) continue;
                tagCount++;
                if ($scope.recipes[recipe].tags.indexOf(tag) > -1) tagMatchCount++;
            }
            if (tagMatchCount == tagCount) $scope.selectedRecipes.push($scope.recipes[recipe]);
        }
    }

    $scope.count = function(tag) {
        var count = 0;
        angular.forEach($scope.recipes, function(r) {
            for (var t in r.tags) {
                if (r.tags[t] == tag) count++;
            }
        });
        return count;
    }

    $scope.loadRecipes = function() {
        $http.get("recipes.json").then(function (response) {
            var tags = {};
            $scope.recipes = response.data;
            $scope.selectedRecipes = response.data;
            for (recipe in response.data) {
                for (tag in response.data[recipe].tags) {
                    tags[response.data[recipe].tags[tag]] = 1;
                }
            }
            $scope.tags = Object.keys(tags).sort();
        },
        function(response) {
            console.log("Failed to read list of recipes: ", response.message);
        });
    }

    $scope.highlight = function(text, search) {
        if (!search) return $sce.trustAsHtml(text);
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<mark>$&</mark>'));
    };

    $scope.loadRecipes();

}]);


app.filter('searchFilter', function() {
    return function(input, search) {
        if (!search) return input;
        if (!input) return input;
        var result = [];
        angular.forEach(input, function(recipe) {
            if (recipe.name.toLowerCase().indexOf(search) > -1) {
                result.push(recipe);
                return;
            }
            try {
                if (recipe.description.toLowerCase().indexOf(search) > -1) {
                    result.push(recipe);
                    return;
                }
            } catch (e) { };
        });
        return result;
    }
});
