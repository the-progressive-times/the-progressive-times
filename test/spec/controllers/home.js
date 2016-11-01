'use strict';

describe('Controller: HomeCtrl', function () {

    // Load the controller's module
    beforeEach(module('starterkit'));

    var HomeCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        HomeCtrl = $controller('homeCtrl', {
            $scope: scope
            // Place here mocked dependencies
        });
    }));

    it('should have a variable called test', function () {
        expect(scope.test.length).toBe(13);
    });
});
