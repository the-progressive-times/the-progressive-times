/**
 * Created by Jackson on 10/20/16.
 */

(function () {
    angular.module('starterkit')
        .factory('fetchUser', FetchUserFactory);

    FetchUserFactory.$inject = ['authentication'];
    function FetchUserFactory(authentication) {
        function getUser(uuid, callback) {
            authentication.getUser(uuid).then(function (response) {
                callback(response.data);
            }, function (response) {
                callback({
                    username: 'Four oh four!',
                    fullname: 'This user cannot be found. Sorry!'
                })
            })
        }

        function getCurrentUser(callback) {
            if (authentication.isLoggedIn()) {
                authentication.getUser(authentication.uuid().uuid).then(function (response) {
                    callback(response.data);
                })
            } else {
                return null;
            }
        }

        function getAllUsers(callback) {
            authentication.getUsers().then(function (response) {
                callback(response.data);
            })
        }

        return {
            getUser: getUser,
            getCurrentUser: getCurrentUser,
            getAllUsers: getAllUsers
        }
    }
})();
