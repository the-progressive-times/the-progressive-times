(function () {
    angular.module('tpt')
        .controller('EditController', EditController);

    EditController.$inject = ['$mdDialog', 'authentication', 'fetchUser', '$location', '$mdToast'];
    function EditController($mdDialog, authentication, fetchUser, $location, $mdToast) {
        var vm = this;
        vm.user = {};
        vm.edit = edit;

        function edit() {
            authentication.edit({
                username: vm.user.username,
                fullname: vm.user.fullname,
                email: vm.user.email
            }).then(function (response) {
                $location.path('/profile/' + vm.user.username);
                authentication.saveToken(response.data.token);
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.data.message)
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
