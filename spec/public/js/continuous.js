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
  $timeout(function() {
    $scope.text = '....loading....4';
  }, 6300);
  $timeout(function() {
    $scope.text = '....loading....5';
  }, 7000);
  $timeout(function() {
    $scope.text = 'loaded';
  }, 7500);
  $timeout(function() {
    $scope.text = 'last-change';
  }, 8500);
});
