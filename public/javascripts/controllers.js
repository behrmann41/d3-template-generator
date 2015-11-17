app.controller('HomeController', ['$scope', function($scope){
  $scope.inputs = [{label: "choice.label1", value: 'choice.value1' }]
  $scope.addField = function (){
    var newItemNo = $scope.inputs.length+1;
    $scope.inputs.push({label: "choice.label" + newItemNo, value: "choice.value"+newItemNo});
  }
  $scope.removeField = function (){
    var lastItem = $scope.inputs.length-1;
    $scope.inputs.splice(lastItem);
  }
  $scope.submit = function (){
    $scope.labels = [],
    $scope.values = []
    $scope.inputs.forEach(function(input){
      $scope.labels.push(input.label1)
      $scope.values.push(input.value1)
    })
  }
}])
