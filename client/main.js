/**
 * Created by Jackson on 10/12/16.
 */
(function () {
    angular.module('tpt', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngAnimate'])
        .controller('MainController', MainController);

    MainController.$inject = ['$mdToast', 'fetchUser', '$scope'];
    function MainController($mdToast, fetchUser, $scope) {
        $scope.$on('$routeChangeStart', function () {
            fetchUser.getCurrentUser(function (user) {
                if (user && user.mustChangePass) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Looks like you need to change your password. Visit your profile page to do so.')
                    )
                }
            });
        });
    }
})();
