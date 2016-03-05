var app = angular.module('Appta', ['ja.qr']);

var shhh = '?apiKey=cwqOL4LsQryNA-Joen-QCiequYWRGCae';

var adminDB = 'https://api.mlab.com/api/1/databases/apptasecurity/collections/admin/'+shhh;
var adminDBSolo = 'https://api.mlab.com/api/1/databases/apptasecurity/collections/admin/';

var codigosDB = 'https://api.mlab.com/api/1/databases/apptasecurity/collections/codigos/'+shhh;
var codigosDBSolo = 'https://api.mlab.com/api/1/databases/apptasecurity/collections/codigos/';


app.controller('AdminCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
  $scope.user = {};

  $scope.auth = false;
  $scope.loading=false;
  $scope.generado = "";
  $scope.accessPlaceholder = "Clave de acceso";
  $scope.changeKPlaceholder = "Nueva clave";
  $scope.usersList = [];
  $scope.newpass = "";

  $scope.editing = false;
  $scope.editingUser;


  var request = {
    method: 'GET',
    url: codigosDB
  };
  $http(request).then(function(response){
    $scope.usersList = response.data;
  });


  $scope.submit = function() {
    var query = {'acceso':$scope.accesskey};
    $scope.loading=true;
    var request = {
      method: 'GET',
      url: adminDB+'&q='+JSON.stringify(query)
    };
    $http(request).then(function(response){
      if(response.data.length>0){
        $scope.auth = true;
        $scope.loading=false;

      } else {
        $scope.accesskey = '';
        $scope.accessPlaceholder = 'Clave incorrecta';
        $scope.loading=false;
      }
    });
  }

  $scope.changeKey = function(){
    $scope.loading=true;
    var request = {
      method: 'PUT',
      url: adminDBSolo+'56d4d3c9e4b05f4fb22a796f'+shhh,
      data: JSON.stringify({"acceso":$scope.newAccesskey})
    };
    if($scope.newAccesskey == $scope.newAccesskey2){
      $http(request).then(function(response){
        $scope.newpass = "Contraseña actualizada";
        $scope.loading=false;
      });
    } else {
      $scope.newpass = 'No coinciden';
      $scope.loading=false;
    }
    $scope.newAccesskey = "";
    $scope.newAccesskey2 = "";
  }

  $scope.storeQR = function(){
    var request = {
      method: 'POST',
      url: codigosDB,
      data: JSON.stringify({'nombre':$scope.user.name, 'direccion':$scope.user.address, 'telefono':$scope.user.tel, 'info':$scope.user.info,'generado':$scope.generado})
    };
    $http(request).then(function(response){
      $scope.usersList.push(response.data);
      $scope.user.name = "";
      $scope.user.address = "";
      $scope.user.tel = "";
      $scope.user.info = "";
    });
  }


  $scope.downloadPng = function(qrimg, userName){
    var dataimg = $('#'+qrimg).find('img').attr('ng-src');
    download(dataimg, userName+'.png', 'image/png');
  }

  $scope.deleteQr = function(id, indx){
    var request = {
      method : 'DELETE',
      url: codigosDBSolo+id+shhh
    };
    $http(request).then(function(response){
      $scope.usersList.splice(indx, 1)
    });
  }


    $scope.editUser = function(theuser){
      $scope.editing = true;
      $scope.editingUser = theuser;

    }

    $scope.updateUser = function(){
      $scope.editing = false;
      var request = {
        method : 'PUT',
        url: codigosDBSolo+$scope.editingUser._id.$oid+shhh,
        data: JSON.stringify({'nombre':$scope.editingUser.nombre, 'direccion':$scope.editingUser.direccion, 'telefono':$scope.editingUser.telefono, 'info':$scope.editingUser.info,'generado':$scope.editingUser.generado})
      };
      console.log($scope.editingUser);
      console.log(codigosDBSolo+$scope.editingUser._id.$oid+shhh);
      $http(request).then(function(response){
        console.log(response);
      });
      $scope.editingUser = {};
    }

    $scope.cancelUpdate = function(){
      $scope.editing = false;
      $scope.editingUser = {};
    }



}]);
