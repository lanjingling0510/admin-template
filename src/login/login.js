require('./login.less');
require('./login.service.js');
const angular = require('angular');

module.exports = angular.module('csm.login', [
    'ui.router',
    'restangular',
    'angular-storage',
    'common.services',
]).config(moduleConfig)
    .controller('LoginController', LoginController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        template: require('./login.html'),
        controller: 'LoginController as vm',
    });
}

/* @ngInject */
function LoginController($rootScope, store, AlertService, $state, Restangular) {
    const vm = this;
    vm.login = login;
    const auth = Restangular.all('auth');
    initController();

    function login(admin) {
        auth.one('token').doPOST(admin).then(function (res) {
            const token = res.access_token;
            store.set('auth.accessToken', token);
            if (!$rootScope.auth) {
                $rootScope.auth = {};
            }
            $rootScope.auth.accessToken = token;
            return auth.one('profile').doGET();
        }).then(function (profile) {
            store.set('auth.profile', profile);
            $rootScope.auth.profile = profile;
            $state.go('v1.chat');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function initController() {
        vm.admin = {
            username: '',
            password: '',
        };
    }
}
