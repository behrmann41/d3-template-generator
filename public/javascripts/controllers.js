app.controller('HomeController', ['$scope', function($scope){
  $scope.submit = function (){
    $scope.labels = []
    $scope.values = []
    $scope.labels.push(this.label1, this.label2, this.label3, this.label4, this.label5)
    $scope.values.push(this.value1, this.value2, this.value3, this.value4, this.value5)
    console.log($scope.labels)
    console.log($scope.values)
  }
}])
