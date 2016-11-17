(function () {
    angular.module('tpt')
        .factory('Access', Access);

    Access.$inject = ['$q', 'fetchUser', 'authentication'];
    function Access($q, fetchUser, authentication) {
        var OK = 200;
        var UNAUTHORIZED = 401;
        var FORBIDDEN = 403;

        function hasPermission(rank) {
            var defer = $q.defer();

            fetchUser.getCurrentUser(function (user) {
                if (!authentication.isLoggedIn()) {
                    defer.reject(UNAUTHORIZED);
                } else if (user.rank >= rank) {
                    defer.resolve(OK);
                } else {
                    defer.reject(FORBIDDEN);
                }
            });

            return defer.promise;
        }

        function shouldBeLoggedIn(loggedIn) {
            return loggedIn ? authentication.isLoggedIn() ? $q.resolve(OK) : $q.reject(FORBIDDEN)
                : authentication.isLoggedIn() ? $q.reject(FORBIDDEN) : $q.resolve(OK);
        }

        return {
            OK: OK,
            UNAUTHORIZED: UNAUTHORIZED,
            FORBIDDEN: FORBIDDEN,
            hasPermission: hasPermission,
            shouldBeLoggedIn: shouldBeLoggedIn
        }
    }
})();
