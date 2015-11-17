app.controller('HomeController', ['$scope', function($scope){
  $scope.inputs = [{label: "choice.label1", value: 'choice.value1' }]
  $scope.addField = function (){
    var newItemNo = $scope.inputs.length+1;
    $scope.inputs.push({label: "choice.label" + newItemNo, value: "choice.value"+newItemNo});
    console.log($scope.inputs);
  }
  $scope.removeField = function (){
    var lastItem = $scope.inputs.length-1;
    $scope.inputs.splice(lastItem);
  }
}])
  // $scope.submit = function (){
  //   $scope.labels = []
  //   $scope.values = []
  //   $scope.labels.push(this.label1, this.label2, this.label3, this.label4, this.label5)
  //   $scope.values.push(this.value1, this.value2, this.value3, this.value4, this.value5)
  //   console.log($scope.labels)
  //   console.log($scope.values)
  // }

// var app = angular.module('angularjs-starter', []);
//
//   app.controller('MainCtrl', function($scope) {
//
//   $scope.choices = [{id: 'choice1'}, {id: 'choice2'}];
//
//   $scope.addNewChoice = function() {
//     var newItemNo = $scope.choices.length+1;
//     $scope.choices.push({'id':'choice'+newItemNo});
//   };
//
//   $scope.removeChoice = function() {
//     var lastItem = $scope.choices.length-1;
//     $scope.choices.splice(lastItem);
//   };
//
// });
