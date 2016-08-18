(function() {
    'use strict';

    angular.module('ticketScanner', ['ui.router', 'ngResource', 'angular.filter',
        'ngCookies', 'ngAnimate', 'ngMaterial', 'angularMoment', 'ui.mask', 'ngStorage',
        'ngMessages'
    ])

    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$urlMatcherFactoryProvider", "$httpProvider", "$mdThemingProvider", function ($stateProvider, $urlRouterProvider, $locationProvider,
            $urlMatcherFactoryProvider, $httpProvider, $mdThemingProvider) {
            $urlMatcherFactoryProvider.strictMode(false);

            $locationProvider
                .html5Mode({
                    enabled: true,
                    requireBase: true
                });

            $stateProvider
                .state('main', {
                    controller: 'MainViewController',
                    controllerAs: 'vm',
                    url: '/',
                    templateUrl: '/ticketScanner/main.html'
                });

            // $httpProvider.interceptors.push('httpInterceptor');

            $mdThemingProvider.theme('default')
                .primaryPalette('red', {
                    'default': '700',
                    'hue-1': '800'
                })
                .accentPalette('purple', {
                    'default': '600'
                })
                .backgroundPalette('grey');
        }])
})();

(function() {
'use strict';

angular
    .module('ticketScanner')
    .controller('MainViewController', MainViewController);

MainViewController.$inject = [];
function MainViewController() {
        var vm = this;

        activate();

        ////////////////

        function activate() { }
    }
})();
