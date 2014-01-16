angular.module('{%= name %}', {%= importedModules %});

{%if (importedModules.indexOf('ui.router') !== -1 && importedModules.indexOf('pascalprecht.translate') === -1) {%}
angular.module('{%= name %}').config(function($stateProvider, $urlRouterProvider) {

});
{%}%}

{%if (importedModules.indexOf('pascalprecht.translate') !== -1 && importedModules.indexOf('ui.router') === -1) {%}
angular.module('{%= name %}').config(function($translateProvider) {

});
{%}%}

{%if (importedModules.indexOf('ui.router') !== -1 && importedModules.indexOf('pascalprecht.translate') !== -1) {%}
angular.module('{%= name %}').config(function($stateProvider, $urlRouterProvider, $translateProvider) {

});
{%}%}

angular.module('{%= name %}').controller('mainController', function ($scope) {
    "use strict";

    $scope.message = "Yeahhh ! You're ready !";
});