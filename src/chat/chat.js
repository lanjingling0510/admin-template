require('./chat.less');
const angular = require('angular');
const io = require('./socket.io.js');

module.exports = angular.module('csm.chat', [
    'ui.router',
    'csm.login.service',
    'common.services',
    'ngAnimate',
]).config(moduleConfig)
    .controller('ChatController', ChatController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('v1.chat', {
        url: '/chat',
        template: require('./chat.html'),
        controller: 'ChatController as vm',
    });
}

/*  @ngInject*/
function ChatController($rootScope, LoginService, AlertService, $state, $timeout, $scope) {
    const profile = $rootScope.auth ? $rootScope.auth.profile : null;
    const socket = io('http://www.cyt-rain.cn:8431');
    const vm = this;

    vm.msg = '';
    vm.login = login;
    vm.logout = logout;
    vm.sendMessage = sendMessage;
    vm.keydown = keydown;
    vm.msgList = [];

    //  =============================
    //  socket部分
    //  =============================

    function login() {
        socket.emit('login', vm.user);
    }

    function logout() {
        socket.disconnect();
        socket.removeAllListeners('connect');
        LoginService();// eslint-disable-line new-cap
    }

    function sendMessage(msg) {
        console.log('send:%s', msg);
        if (/^\s*$/.test(msg)) return;
        socket.emit('new message', msg);
        vm.msg = '';
    }

    function keydown(msg) {
        if (event.keyCode === 13) {
            vm.sendMessage(msg);
            return false;
        } else {// eslint-disable-line no-else-return
            return true;
        }
    }


    //  接收连接
    socket.on('connect', () => {
        console.log('connect ...');
        if (!profile) {
            vm.logout();
            $state.go('login');
            return;
        }

        vm.user = {
            _id: profile._id,
            nickname: profile.nickname,
            username: profile.username,
        };

        login();
    });


    socket.on('user list', userList => {
        vm.msgList.push(Object.assign(vm.user, {type: 'welcome'}));
        $scope.$emit('user:list', userList);
    });

    socket.on('new user', user => {
        $timeout(() => {
            vm.msgList.push(Object.assign(user, {type: 'welcome'}));
            $scope.$emit('user:new', user);
        }, 1);
    });

    socket.on('new message', msgObject => {
        console.log('receive:%s', msgObject.content);
        $timeout(() => {
            vm.msgList.push(msgObject);
            $('.csm-chat section').scrollTop(9999);
        }, 1);
    });

    socket.on('user left', user => {
        vm.msgList.push(Object.assign(user, {type: 'goodbye'}));
        $scope.$emit('user:left', user);
    });

    socket.on('error', err => {
        socket.disconnect();
        socket.removeAllListeners('connect');
        AlertService.warning(err);
    });

    socket.on('duplicate', ()=> {
        AlertService.warning('重复登录', () => {
            socket.disconnect();
            socket.removeAllListeners('connect');
            $state.go('login');
        });
    });
}
