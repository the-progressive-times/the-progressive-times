/**
 * Created by Jackson on 10/12/16.
 */
(function () {
    angular
        .module('starterkit')
        .controller('HomeController', HomeController);

    function HomeController() {
        var vm = this;
        vm.test = 'Hello, world!';
    }
})();
