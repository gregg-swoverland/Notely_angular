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
        templateUrl: '/notes/notes.html', // inserted wherever UI directive <UI-veiw> is located
        controller: NotesController
      })

      .state('notes.form', {  // make this a child state of notes using .form
        url: '/:noteId',
        templateUrl: '/notes/notes-form.html'
      });
    }

      NotesController['$inject'] = ['$state'];
      function NotesController($state) {
        $state.go('notes.form');
      }
})();
