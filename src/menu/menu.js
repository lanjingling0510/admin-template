require('./menu.less');
const angular = require('angular');

module.exports = angular.module('csm.menu', [
    'ui.router',
    'ui.bootstrap',
])
    .config(moduleConfig)
    .controller('MenuController', MenuController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('v1', {
        url: '/v1',
        abstract: true,
        template: require('./menu.html'),
        controller: 'MenuController as vm',
    });
}

/* @ngInject */
function MenuController() {
    const vm = this;
    vm.openMenu = openMenu;
    vm.closeMenu = closeMenu;
    const menu = document.querySelector('.menu');
    const shape = menu.querySelector('.csm-menu-shape');
    const svg = Snap(shape.querySelector('.menu svg')); // eslint-disable-line new-cap
    const path = svg.select('path');
    const steps = shape.getAttribute('data-morph-open').split(';');
    let isAnimating = false;


    //  =============================
    //  导航菜单部分
    //  =============================


    function nextStep(pos) {
        if (pos > steps.length - 1) {
            isAnimating = false;
            return;
        }
        path.animate({'path': steps[pos]}, pos === 0 ? 400 : 500, pos === 0 ? mina.easein : mina.elastic, function () {
            pos++;
            nextStep(pos);
        });
    }

    function openMenu() {
        if (isAnimating) return false;
        isAnimating = true;
        menu.classList.add('show-menu');
        // animate path
        nextStep(0);
    }


    function closeMenu() {
        if (isAnimating) return false;
        isAnimating = true;
        menu.classList.remove('show-menu');
        // animate path
        setTimeout(() => {
            // reset path
            path.attr('d', steps[1]);
            isAnimating = false;
        }, 300);
    }
}
