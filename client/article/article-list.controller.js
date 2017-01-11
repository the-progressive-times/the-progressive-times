(function () {
    angular.module('tpt')
        .controller('ArticleListController', ArticleListController);

    ArticleListController.$inject = ['fetchUser', 'fetchArticle'];
    function ArticleListController(fetchUser, fetchArticle) {
        var vm = this;
        vm.articles = [];

        fetchArticle.fetchArticles(function (articles) {
            for (var i = 0; i < articles.length; i++) {
                (function () {
                    var article = articles[i];

                    fetchUser.getUser(article.author, function (user) {
                        article.user = user;
                        vm.articles.push(article);
                    });
                })();
            }
        })
    }
})();
