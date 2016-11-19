(function () {
    angular.module('tpt')
        .service('article', ArticleService);

    ArticleService.$inject = ['$http', 'authentication'];
    function ArticleService($http, authentication) {
        this.createArticle = function (article) {
            return $http({
                method: 'POST',
                url: '/api/create_article',
                headers: {
                    authorization: 'Bearer ' + authentication.getToken()
                },
                data: article
            })
        }
    }
})();
