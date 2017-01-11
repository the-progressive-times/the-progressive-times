(function () {
    angular.module('tpt')
        .factory('fetchArticle', FetchArticleFactory);

    FetchArticleFactory.$inject = ['article'];
    function FetchArticleFactory(article) {
        function fetchArticle(id, callback) {
            article.getArticle(id).then(function (response) {
                fetchLogs(id, function (logs) {
                    response.data.logs = logs;
                    callback(response.data);
                })
            })
        }

        function fetchArticles(callback) {
            article.getArticles().then(function (response) {
                var articles = [];
                response.data.forEach(function (article) {
                    fetchLogs(article._id, function (logs) {
                        article.logs = logs;
                        articles.push(article);

                        if (articles.length === response.data.length) {
                            callback(articles);
                        }
                    })
                });
            })
        }

        function fetchLogs(id, callback) {
            article.getLogs(id).then(function (response) {
                callback(response.data);
            })
        }

        return {
            fetchArticle: fetchArticle,
            fetchArticles: fetchArticles,
            fetchLogs: fetchLogs
        }
    }
})();
