/**
 * Created by Jackson on 10/20/16.
 */

(function () {
    angular.module('tpt')
        .controller('AdminRegisterController', RegisterController);

    RegisterController.$inject = ['$location', 'authentication', '$mdToast'];
    function RegisterController($location, authentication, $mdToast) {
        var vm = this;
        vm.user = {};
        vm.loading = false;
        vm.ranks = [
            {
                text: 'Administrator',
                numeric: 4,
            },
            {
                text: 'Editor',
                numeric: 3
            },
            {
                text: 'Reporter',
                numeric: 2
            },
            {
                text: 'Member',
                numeric: 1
            }
        ];

        vm.register = function () {
            vm.loading = true;
            authentication.adminRegister(vm.user, function (response) {
                vm.loading = false;

                if (response.status == 200) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('You have successfully registered a new user.')
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
