# Simple AutoCompleter

Created for Angular 1.3

### Directions

Just add a `script` for the `autocompleter`.

```html
<script type="text/javascript" src="javascripts/autocompleter.js" ></script>
```

Then add it to your app dependencies.

```javascript
angular.module("YourApp", [
  "AutoCompleter"
]);
```

Where you might add some html like the following:

```html
<div ng-app="YourApp">
  <div ng-controller="YourCtrl">
    <auto-complete on-change="logSuggestions(words)" load-handler="load"></auto-complete>
  </div>
</div>

```


There are two ways load words into the `<auto-complete>` directive. One way is just to do the following:

```javascript
angular("YourCtrl", ["$scope", function (scope) {
  $scope.load = function () {
    return [
            "begin", 
            "began",
            "beg",
            "best",
            "better"
            ];
  };
}]);
```

The other way is to load them asynchronously


```javascript
angular("YourCtrl", ["$scope", "$http", function (scope, $http) {
  $scope.load = function (done) {
    $http.get("/mywords.json")
      .success(function (data) {
        done(data);s
      });
  };
}]);
```













