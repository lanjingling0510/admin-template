const angular = require('angular');

module.exports = angular.module('csm.login.service', [])
    .service('LoginService', LoginService);

/* @ngInject */
function LoginService($rootScope, store, $state) {
    return logout;

    function logout() {
        delete $rootScope.auth;

        store.remove('auth.profile');
        store.remove('auth.accessToken');

        // $location.path('/login');
        $state.go('login');
    }
}
