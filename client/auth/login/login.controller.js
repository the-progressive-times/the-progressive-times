/**
 * Created by Jackson on 10/20/16.
 */

(function () {
    angular.module('starterkit')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'authentication', '$mdToast'];
    function LoginController($location, authentication, $mdToast) {
        var vm = this;
        vm.user = {};

        vm.login = function () {
            authentication.login(vm.user, function (response) {
                if (response.status === 200) {
                    $location.path('/');
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('You have successfully logged in! Welcome!')
                            .hideDelay(3000)
                    )
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Incorrect email or password. Please try again.')
                            .hideDelay(3000)
                    )
                }
            })
        };
    }
})();
