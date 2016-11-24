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
        };

        this.getArticle = function (id) {
            return $http.get('/api/get_article/' + id);
        };

        this.getArticles = function () {
            return $http.get('/api/get_articles');
        };

        this.getLogs = function (id) {
            return $http.get('/api/get_logs/' + id);
        }
    }
})();
