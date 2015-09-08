
const angular = require('angular');
const jqLite = angular.element;

/**
 * @ngdoc service
 * @name commonModal
 * @module common.modal.service
 *
 */

module.exports = angular.module('common.services')
    .factory('commonModal', commonModal);

/* @ngInject*/
function commonModal($q, $document, $compile, $rootScope) {
    return {
        fromTemplateUrl: fromTemplateUrl,
    };

    /**
     * @ngdoc method
     * @param url
     * @param options
     * @name fromTemplateUrl
     * @desc add a modal in document return a promise object
     */
    function fromTemplateUrl(url, options) {
        const defer = $q.defer();
        createModal(url, options, defer);
        return defer.promise;
    }

    /**
     * @ngdoc method
     * @param url
     * @param options
     * @param defer
     */
    function createModal(url, options, defer) {
        // Create a new scope for the modal
        const scope = options.scope && options.scope.$new() || $rootScope.$new(true);
        const element = $compile(url)(scope);
        const modal = new Modal(element, scope, $document);
        defer.resolve(modal);
    }
}

/**
 * @ngdoc constructor
 * @param element
 * @param scope
 * @param parent
 *
 */
function Modal(element, scope, parent) {
    this.element = element;
    this.scope = scope;
    this.parent = parent;
    this._init();
}

Modal.prototype = {
    _init: _init,
    show: show,
    hide: hide,
};

function _init() {
    const self = this;
    self.parent[0].body.appendChild(self.element[0]);
}

function show() {
    const self = this;
    const element = self.element;
    const openModal = jqLite(element.children()[0]);
    element.css('display', 'block');
    element.addClass('am-active');
    openModal.css('display', 'block');
    openModal.css('margin-top', '-100px');
    setTimeout(function () {
        openModal.removeClass('am-modal-out').addClass('am-modal-active');
    }, 100);
}

function hide() {
    const self = this;
    const element = self.element;
    const openModal = jqLite(element.children()[0]);
    openModal.removeClass('am-modal-active').addClass('am-modal-out');
    setTimeout(function () {
        openModal.css('display', 'none');
        element.css('display', 'none');
        element.removeClass('am-active');
    }, 200);
}

