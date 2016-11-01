/**
 * Created by Jackson on 9/30/16.
 */

(function () {
    angular.module('starterkit')
        .controller('NavigationController', NavigationController);

    NavigationController.$inject = ['$scope', '$route', '$location', '$mdSidenav', '$mdToast', 'authentication', 'fetchUser'];
    function NavigationController($scope, $route, $location, $mdSidenav, $mdToast, authentication, fetchUser) {
        var vm = this;
        vm.user = {
            username: 'Guest'
        };

        vm.nav = [
            {
                icon: 'home',
                location: 'Home',
                path: '#/'
            },
            {
                icon: 'group',
                location: 'Members',
                path: '#/members'
            }
        ];

        vm.toggleSidenav = function () {
            $mdSidenav('navigation').toggle();
        };

        vm.toggleUsernav = function () {
            $mdSidenav('userNav').toggle();
        };

        vm.logout = function () {
            authentication.logout();
            $location.path('/');
            $mdToast.show(
                $mdToast.simple()
                    .textContent('You have successfully logged out.')
                    .hideDelay(3000)
            )
        };

        $scope.$on('$routeChangeStart', function (next, current) {
            if (authentication.isLoggedIn()) {
                authentication.validate()
                    .then(function success(response) {
                        // do nothing
                    }, function failure(response) {
                        vm.logout();
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Your token has been invalidated. Please log in again.')
                                .hideDelay(3000)
                        )
                    })
            }
        });

        $scope.$watch(function () {
            return authentication.getToken();
        }, function (newValue, oldValue) {
            vm.userNav = [];

            if (authentication.isLoggedIn()) {
                vm.userNav = [];
                vm.userNav.push({
                    icon: 'person',
                    location: 'Your Profile',
                    path: '#/profile/' + vm.user.username
                });

                fetchUser.getCurrentUser(function (user) {
                    vm.user = user;

                    if (vm.user.rank === 3) {
                        vm.userNav.push({
                            icon: 'dashboard',
                            location: 'Admin Panel',
                            path: '#/blogs'
                        });
                    }

                    vm.userNav[0].path = '#/profile/' + vm.user.username;
                })
            } else {
                vm.userNav = [];
                vm.userNav.push({
                        icon: 'exit_to_app',
                        location: 'Login',
                        path: '#/login'
                    },
                    {
                        icon: 'person_add',
                        location: 'Register',
                        path: '#/register'
                    });

                vm.user = {
                    username: 'Guest'
                }
            }

            vm.isLoggedIn = authentication.isLoggedIn();
        });
    }
})();
