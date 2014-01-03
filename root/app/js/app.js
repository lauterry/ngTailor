angular.module('{%= name %}', {%= importedModules %});


{% if (importedModules.indexOf('ui.router') !== -1) { %}

angular.module('{%= name %}').config(function($stateProvider, $urlRouterProvider) {
    // set up your states here

});

{% } %}

angular.module('{%= name %}').controller('mainController', function ($scope) {
    "use strict";

    $scope.message = "Yeahhh ! You're ready !";
});