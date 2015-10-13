const angular = require('angular');

module.exports = angular.module('csm.register', [
    'ui.router',
    'restangular',
    'common.services',
]).config(moduleConfig)
    .controller('RegisterController', RegisterController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('register', {
        url: '/register',
        template: require('./register.html'),
        controller: 'RegisterController as vm',
    });
}


/* @ngInject */
function RegisterController(Restangular, AlertService) {
    const vm = this;
    const User = Restangular.all('user');
    vm.registerUser = registerUser;

    function registerUser(user) {
        User.post(user).then(() => {
            AlertService.success('注册成功！');
        }).catch((e) => {
            console.log(e);
            AlertService.warning(e.data);
        });
    }
}
