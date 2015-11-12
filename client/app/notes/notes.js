(function() {
  
  angular.module('notely.notes', [
    'ui.router',
    'textAngular'
  ])
  .config(notesConfig);

  notesConfig['$inject'] = ['$stateProvider']; // preserves D.I. under minification
  function notesConfig($stateProvider) {
    $stateProvider
      // each url is a state

      .state('notes', {
        url: '/notes',
        resolve: {
          // see https://github.com/angular-ui/ui-router/wiki
          notesLoaded: ['NotesService', function(NotesService) {
            return NotesService.fetch();
          }]
        },
        templateUrl: '/notes/notes.html', // inserted wherever UI directive <UI-veiw> is located
        controller: NotesController
      })

      .state('notes.form', {  // make this a child state of notes using .form
        url: '/:noteId',
        templateUrl: '/notes/notes-form.html',
        controller: NotesFormController
        // Don't need this since it's a child of /notes
        //controller: NotesController
      });
    }

      NotesController['$inject'] = ['$state', '$scope', 'NotesService'];
      function NotesController($state, $scope, NotesService) {
        $scope.note = {};
        $scope.notes = NotesService.get();
      }

      NotesFormController.$inject = ['$scope', '$state', 'NotesService'];
      function NotesFormController($scope, $state, NotesService) {
        $scope.note = NotesService.findById($state.params.noteId);

        $scope.save = function() {
          // Decide if we need to call create or update
          if ($scope.note._id) {
            NotesService.update($scope.note).then(function(response) {
              $scope.note = angular.copy(response.data.note);
            });
          }
          else {
            NotesService.create($scope.note, function(response) {
              $state.go('notes.form', { noteId: response.data.note._id })
              });
          }
        };

        $scope.delete = function() {
          NotesService.delete($scope.note).then(function(response) {
            $state.go('notes.form', { noteId: undefined });
          });
        };

        $scope.buttonText = function() {
          if ($scope.note._id) {
            return 'Update';
          }
          return 'Save';
        }

      };
})();
