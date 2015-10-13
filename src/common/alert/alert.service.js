const angular = require('angular');
const url = require('./modal.html');

module.exports = angular.module('common.services')
    .factory('AlertService', AlertService);

/* @ngInject */
function AlertService($rootScope, commonModal, $timeout) {
    const scope = $rootScope.$new(true);
    let modal;

    initModal();
    return {
        success: success,
        info: info,
        warning: warning,
        danger: danger,
        confirm: confirm,
    };


    function initModal() {
        commonModal.fromTemplateUrl(url, {scope: scope}).then(function (md) {
            scope.modal = modal = md;
        });
    }

    function success(content) {
        scope.texts = {
            icon: 'am-icon-check am-text-success',
            title: '成功',
            body: content,
            closeButton: '确定',
            noDismiss: true,
        };
        modal.show();
    }

    function info(content) {
        scope.texts = {
            title: '提示',
            body: content,
            closeButton: '确定',
            noDismiss: true,
        };
        modal.show();
    }

    function warning(content, callback = angular.noop) {
        scope.texts = {
            icon: 'am-icon-exclamation am-text-danger',
            title: '警告',
            body: content,
            closeButton: '',
            dismissButton: '确定',
            noDismiss: false,
        };
        modal.callback = function () {
            modal.hide();
            callback();
        };
        $timeout(() => {
            modal.show();
        }, 1);
    }

    function danger(content, callback) {
        scope.texts = {
            icon: 'am-icon-exclamation am-text-danger',
            title: '危险',
            body: content,
            closeButton: '我了解',
            dismissButton: '取消',
            noDismiss: false,
        };
        modal.callback = function () {
            modal.hide();
            callback();
        };
        modal.show();
    }

    function confirm(content, callback) {
        scope.texts = {
            title: '你确定吗？',
            body: content,
            closeButton: '我确定',
            dismissButton: '再想想',
            noDismiss: false,
        };
        modal.callback = function () {
            modal.hide();
            callback();
        };
        modal.show();
    }
}
