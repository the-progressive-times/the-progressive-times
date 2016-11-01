/**
 * Created by Jackson on 10/20/16.
 */

(function () {
    angular.module('starterkit')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['fetchUser', '$routeParams', '$mdDialog'];
    function ProfileController(fetchUser, $routeParams, $mdDialog) {
        var vm = this;
        vm.user = {};
        vm.editProfile = editProfile;
        vm.changePassword = changePassword;

        fetchUser.getUser($routeParams.user, function (response) {
            vm.user = response;
        });

        function editProfile() {
            $mdDialog.show({
                templateUrl: 'profile/edit/edit.template.html',
                controller: 'EditController',
                controllerAs: 'vm',
                clickOutsideToClose: true
            })
        }

        function changePassword() {
            $mdDialog.show({
                templateUrl: 'profile/password/password.template.html',
                controller: 'PasswordController',
                controllerAs: 'vm',
                clickOutsideToClose: true
            })
        }
    }
})();
