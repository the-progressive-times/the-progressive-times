/**
 * Created by Jackson on 9/30/16.
 */

(function () {
    angular.module('tpt')
        .directive('navigation', NavigationDirective);

    function NavigationDirective() {
        return {
            restrict: 'EA',
            templateUrl: '/common/directives/navigation/navigation.template.html',
            controller: 'NavigationController',
            controllerAs: 'vm'
        }
    }
})();
