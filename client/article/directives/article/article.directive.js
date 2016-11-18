(function () {
    angular.module('tpt')
        .directive('article', ArticleDirective);

    function ArticleDirective() {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'article/directives/article/article.template.html',
            scope: {
                author: '='
            }
        }
    }
})();
