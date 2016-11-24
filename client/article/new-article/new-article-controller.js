(function () {
    angular.module('tpt')
        .controller('NewArticleController', NewArticleController);

    NewArticleController.$inject = ['article', '$location'];
    function NewArticleController(article, $location) {
        var vm = this;
        vm.article = {};
        vm.submit = function () {
            article.createArticle(vm.article)
                .then(function (response) {
                    $location.path('/article/' + response.data.article._id);
                });
        }
    }
})();
