(function () {
    angular.module('tpt')
        .config(config);

    config.$inject = ['$routeProvider', '$mdThemingProvider', '$locationProvider'];
    function config($routeProvider, $mdThemingProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/home/home.view.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            })

            .when('/register', {
                templateUrl: '/auth/register/register.view.html',
                controller: 'RegisterController',
                controllerAs: 'vm',
                resolve: {
                    access: ['Access', function (Access) {
                        return Access.shouldBeLoggedIn(false);
                    }]
                }
            })

            .when('/login', {
                templateUrl: '/auth/login/login.view.html',
                controller: 'LoginController',
                controllerAs: 'vm',
                resolve: {
                    access: ['Access', function (Access) {
                        return Access.shouldBeLoggedIn(false);
                    }]
                }
            })

            .when('/members', {
                templateUrl: 'members/members.view.html',
                controller: 'MemberController',
                controllerAs: 'vm'
            })

            .when('/profile/:user', {
                templateUrl: '/profile/profile.view.html',
                controller: 'ProfileController',
                controllerAs: 'vm'
            })

            .when('/article', {
                templateUrl: '/article/article-list.view.html',
                controller: 'ArticleListController',
                controllerAs: 'vm'
            })

            .when('/article/new', {
                templateUrl: '/article/new-article/new-article.view.html',
                controller: 'NewArticleController',
                controllerAs: 'vm',
                resolve: {
                    access: ['Access', function (Access) {
                        return Access.hasPermission(2);
                    }]
                }
            })

            .when('/article/:id', {
                templateUrl: '/article/article-view/article.view.html',
                controller: 'ArticleController',
                controllerAs: 'vm'
            })

            .when('/admin/register', {
                templateUrl: '/admin/register/register.view.html',
                controller: 'AdminRegisterController',
                controllerAs: 'vm',
                resolve: {
                    access: ['Access', function (Access) {
                        return Access.hasPermission(4);
                    }]
                }
            })

            .otherwise({
                templateUrl: '404.html'
            });

        $locationProvider.html5Mode(true);

        $mdThemingProvider
            .theme('default')
            .primaryPalette('indigo')
            .accentPalette('pink')
            .warnPalette('red')
            .backgroundPalette('grey');
    }
})();
