angular.module('app', ['ng']).controller('waitingController', function($scope, $timeout) {
  $timeout(function() {
    $scope.text = '....loading....1';
  }, 750);
  $timeout(function() {
    $scope.text = '....loading....2';
  }, 1500);
  $timeout(function() {
    $scope.text = '....loading....3';
  }, 2500);
  $timeout(function() {
    $scope.text = 'waited';
  }, 5400);
});
