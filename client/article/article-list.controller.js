(function () {
    angular.module('tpt')
        .controller('ArticleListController', ArticleListController);

    ArticleListController.$inject = ['fetchUser'];
    function ArticleListController() {
        var vm = this;
        vm.user = {
            username: 'jackson-y',
            fullname: 'Jackson Yeager'
        };
    }
})();
