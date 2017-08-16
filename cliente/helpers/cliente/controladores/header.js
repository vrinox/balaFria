angular.module('balafria')
.controller('ctrlHeaderCli', ['$rootScope','$state','$sesion','$auth','$mdDialog','$http','$mdSidenav','$mdToast', function ($rootScope,$state,$sesion,$auth,$mdDialog,$http,$mdSidenav,$mdToast){
  var yo = this;
  $sesion.obtenerPerfil()
    .then(function(perfil){
      yo.usuario = perfil;
      $sesion
        .actualizarDatos($http)
        .then(function(usuarioFull){
          yo.usuario = usuario;
        });
    })
    .catch(function(error){
      yo.usuario = null;
    });
    yo.registro = function(){
        $http.post('/api/cliente',yo.cliente)
          .then(function(resp){
            var user = {
              "nombre":resp.data.nombre,
              "apellido":resp.data.apellido,
              "documento":resp.data.documento,
              "id":resp.data.id_cliente,
              "email":resp.data.email,
              "token":resp.data.token,
            };
            yo.inicioSesion(user);
          });
    };
    yo.login = function(){
        $auth.login({
          field: yo.field,
          clave: yo.clave,
          tipo: "cliente"
        })
        .then(function(response){
            if(response.data.success){
              yo.inicioSesion(response.data.user);
            }else{
              $mdToast.show(
                $mdToast.simple()
                  .textContent("Error de Autenticacion")
                  .position('top left')
                  .hideDelay(3000)
              );
            }
        })
        .catch(function(response){
          console.error(new Error(response));
        });
    };
  yo.authenticate = function(provider) {
      $auth.authenticate(provider);
    };
  yo.logOut = function(){
    $auth.logout()
          .then(function() {
              // Desconectamos al usuario y lo redirijimos
              $sesion.desconectar();
              yo.usuario = null;
              $rootScope.$broadcast('sesion finalizada');              
              yo.toggleRight();
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Sesion cerrada de forma exitosa')
                  .position('top left')
                  .hideDelay(3000)
              );
          });
  };
  yo.inicioSesion = function(user){
    $sesion.crear(user,'cliente').conectar();
    $sesion
      .obtenerPerfil()
      .then(function(perfil){
        yo.usuario = perfil;
        $rootScope.$broadcast('inicio sesion');
        yo.toggleRight();
        $sesion
          .actualizarDatos($http)
          .then(function(usuarioFull){
            yo.usuario = usuarioFull;
            $mdToast.show(
              $mdToast.simple()
                .textContent('Bienvenido '+usuarioFull.nombre+' '+usuarioFull.apellido)
                .position('top left')
                .hideDelay(3000)
            );
          });
      })
  };
  yo.cambiarImagen = function(ev){
    $mdDialog.show({
      controller: 'ctrlCambiarImg',
      controllerAs: 'form',
      templateUrl: '/views/plantillas/cliente/cambiarImagen.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    }).then(function(cambio){
      console.log(cambio);
      if(cambio){
        yo.usuario = $sesion.actualizarDatos($http);
      }
    });
  }
  yo.toggleLeft = buildToggler('left');
  yo.toggleRight = buildToggler('right');

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }
}])
