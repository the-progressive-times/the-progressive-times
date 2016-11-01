(function () {
    angular.module('starterkit')
        .controller('PasswordController', EditController);

    EditController.$inject = ['$mdDialog', 'authentication', 'fetchUser', '$location', '$mdToast'];
    function EditController($mdDialog, authentication, fetchUser, $location, $mdToast) {
        var vm = this;
        vm.user = {};
        vm.edit = edit;

        function edit() {
            authentication.changePassword({
                current: vm.user.current,
                password: vm.user.password,
                confirm: vm.user.confirm
            }).then(function (response) {
                authentication.logout();
                $location.path('/');
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.data.message)
                );
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('You have been automatically logged out. Please log in again.')
                        .hideDelay(3000)
                );
                $mdDialog.cancel();
            }, function (response) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.data.message)
                )
            })
        }

        fetchUser.getCurrentUser(function (response) {
            vm.user = response;
        });
    }
})();
