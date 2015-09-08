const angular = require('angular');

module.exports = angular.module('csm.home', [
    'ui.router',
    'csm.login.service',
]).config(moduleConfig)
    .controller('HomeController', HomeController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('v1.home', {
        url: '/home',
        template: require('./home.html'),
        controller: 'HomeController as vm',
    });
}

/*  @ngInject*/
function HomeController(LoginService) {
    const vm = this;
    vm.backLogout = function () {
        LoginService();
    };
}
