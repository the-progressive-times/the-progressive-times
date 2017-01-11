(function () {
    angular.module('tpt')
        .controller('ArticleController', ArticleController);

    ArticleController.$inject = ['fetchUser', 'fetchArticle', '$routeParams'];
    function ArticleController(fetchUser, fetchArticle, $routeParams) {
        var vm = this;
        vm.article = {};

        fetchArticle.fetchArticle($routeParams.id, function (article) {
            vm.article = article;

            fetchUser.getUser(vm.article.author, function (user) {
                vm.article.user = user;
            })
        });
    }
})();
