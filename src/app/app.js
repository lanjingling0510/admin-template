require('./app.less');

const angular = require('angular');

require('../common/service.js');
require('../login/login.js');
require('../menu/menu.js');
require('../home/home.js');

module.exports = angular.module('csm', [
    'ui.router',
    'angular-storage',
    'csm.login',
    'csm.menu',
    'csm.home',
]).config(moduleConfig).run(moduleRun);

/* @ngInject */
function moduleConfig($urlRouterProvider, $locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('v1/home');
    RestangularProvider.setBaseUrl('/apis');
    RestangularProvider.setRestangularFields({id: '_id'});
}

/* @ngInject */
function moduleRun($rootScope, $location, store) {
    if (!$rootScope.auth || !$rootScope.auth.profile || !$rootScope.auth.accessToken) {
        if (store.get('auth.profile') && store.get('auth.accessToken')) {
            $rootScope.auth = {
                profile: store.get('auth.profile'),
                accessToken: store.get('auth.accessToken'),
            };
            return null;
        }
    }
}
