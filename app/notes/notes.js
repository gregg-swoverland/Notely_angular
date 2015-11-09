(function() {
  angular.module('notely.notes', [
    'ui.router',
  ])
  .config(notesConfig);

  notesConfig['$inject'] = ['$stateProvider']; // preserves D.I. under minification
  function notesConfig($stateProvider) {
    $stateProvider
      // each url is a state

      .state('notes', {
        url: '/notes',
        template: '<h1>Notely</h1><p>{{ message }}</p><div ui-view></div>', // inserted wherever UI directive <UI-veiw> is located
        controller: NotesController
      })

      .state('notes.form', {  // make this a child state of notes using .form
        url: '/:noteId',
        templateUrl: '/notes/notes-form.html'
      })
    }

      NotesController['$inject'] = ['$scope'];
      function NotesController($scope) {
        $scope.message = "I <3 Angular.";
      }
})();
