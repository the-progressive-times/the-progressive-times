/**
 * Created by Jackson on 10/20/16.
 */

(function () {
    angular.module('starterkit')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$location', 'authentication', '$mdToast'];
    function RegisterController($location, authentication, $mdToast) {
        var vm = this;
        vm.user = {};

        vm.register = function () {
            authentication.register(vm.user, function (response) {
                if (response.status == 200) {
                    $location.path('/');
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('You have successfully registered!')
                            .hideDelay(3000)
                    )
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(response.data.message)
                            .hideDelay(3000)
                    )
                }
            })
        };
    }
})();
