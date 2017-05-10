angular.module('balafria')
.controller('ctrlProveedor', ['$scope','$state','$mdDialog','Upload','$sesion', function ($scope,$state,$mdDialog,Upload,$sesion){
  var yo = this;
  yo.textoBoton = "envialo";
  yo.submit = function(){ //function to call on form submit
    if(yo.upload_form.$valid){
       if (yo.upload_form.file.$valid && yo.file) { //check if from is valid
          yo.upload(yo.file); //call upload function
       }else{
         console.warn('formulario archivo invalido');
       }
    }else{
      console.warn('formulario invalido');
    }
  };
  yo.upload = function (file) {
     Upload.upload({
         url: '/api/proveedor',
         data:{
           file:file,
           nombre:yo.nombre,
           documento:yo.rif,
           email:yo.email,
           clave:yo.clave
         }
     }).then(function (resp) { //upload function returns a promise
       var user = {
         "nombre":resp.data.nombre,
         "documento":resp.data.documento,
         "id":resp.data.id,
         "email":resp.data.email,
         "token":resp.data.token,
         "avatar":{
           "id":resp.data.imagen.id,
           "ruta":resp.data.imagen.ruta
         }
       };
       $sesion.crear(user,'proveedor').conectar();
       $state.go('proveedor.verificarCorreo');
     }, function (resp) { //catch error
         console.log('Error status: ' + resp.status);
     }, function (evt) {
         console.log(evt);
         var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
         console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
         yo.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
     });
   };
}])
.controller('ctrlCorreo', ['$state','$sesion', function ($state,$sesion){
  var yo = this;
  yo.usuario = $sesion.perfil;
}])
.controller('ctrlHeaderPro', ['$state','$sesion','$auth', function ($state,$sesion,$auth){
  var yo = this;
  yo.usuario = $sesion.perfil;
  yo.logOut = function(){
    $auth.logout()
          .then(function() {
              // Desconectamos al usuario y lo redirijimos
              $sesion.desconectar();
              $state.go("frontPage");
          });
  };
}])
.controller('ctrlLogPro', ['$scope','$http','$state','$sesion','$auth', function ($scope,$http,$state,$sesion,$auth) {
  $scope.login = function(){
        $auth.login({
            "field": $scope.field,
            "clave": $scope.clave,
            "tipo": "proveedor"
        })
        .then(function(response) {
          $sesion.crear(response.data.user,'proveedor').conectar();
          $state.go('proveedor.dashboard');
        })
        .catch(function(response) {
            // Si ha habido errores, llegaremos a esta función
            console.error(new Error(response));
        });
    };
}]);
