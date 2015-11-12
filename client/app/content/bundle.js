'use strict';

(function () {
  var app = angular.module('notely', ['ui.router', 'notely.notes']);

  function config($urlRouterProvider) {
    $urlRouterProvider.otherwise('/notes/'); //default route
  };

  config['$inject'] = ['$urlRouterProvider'];
  app.config(config);

  app.constant('API_BASE', 'http://localhost:3000/api/v1/');
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

angular.module('notely').directive('signUp', ['UsersService', function (UsersService) {
  var SignUpController = (function () {
    function SignUpController() {
      _classCallCheck(this, SignUpController);

      this.user = {};
    }

    _createClass(SignUpController, [{
      key: 'submit',
      value: function submit() {
        UsersService.create(this.user);
      }
    }]);

    return SignUpController;
  })();

  return {
    scope: {},
    controller: SignUpController,
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: '/components/sign-up.html'
  };
}]);
'use strict';

(function () {
  angular.module('notely').config(usersConfig);
  usersConfig.$inject = ['$stateProvider'];
  function usersConfig($stateProvider) {
    $stateProvider.state('sign-up', {
      url: '/sign-up',
      template: '<sign-up></sign-up>'
    });
  };
})();
'use strict';

angular.module('notely').service('NotesService', NotesService);

// handle CRUD ops against the server
NotesService.$inject = ['$http', 'API_BASE'];
function NotesService($http, API_BASE) {
  var self = this; // self == NotesService
  self.notes = [];
  self.users = [];

  // Get all notes from server
  self.fetch = function () {
    return $http.get(API_BASE + 'notes').then(
    // Success callback
    function (response) {
      self.notes = response.data;
    },
    // Failure callback
    function (response) {
      // TODO: Handle failure
    });
  };

  self.get = function () {
    return self.notes;
  };

  self.findById = function (noteId) {
    // Look through `self.notes` for a note with a matching _id.
    for (var i = 0; i < self.notes.length; i++) {
      if (self.notes[i]._id === noteId) {
        return angular.copy(self.notes[i]);
      }
    }
    return {};
  };
  /*
    self.findById = function(noteId) {
      // Look through self.notes
        for (var n in self.notes) {
          console.log('note.title = ', n.title)
          if (n.noteId == noteId)
          return n;
        }
    };
  */
  self.create = function (note, callback) {
    var noteCreatePromise = $http.post(API_BASE, { note: note });
    noteCreatePromise.then(function (response) {
      self.notes.unshift(response.data.note);
      //$state.go('notes.form', { noteId: response.data.note._id });
    });
    return noteCreatePromise;
  };

  self.update = function (note) {
    console.log('self.update');
    var noteUpdatePromise = $http.put(API_BASE + note._id, {
      note: {
        title: note.title,
        body_html: note.body_html
      }
    }
    //self.notes.unshift(response.data.note);
    );
    noteUpdatePromise.then(function (response) {
      console.log('self.update success');
      self.replaceNote(response.data.note);
    });
    return noteUpdatePromise;
  };

  self.replaceNote = function (note) {
    for (var i = 0; i < self.notes.length; i++) {
      if (self.notes[i]._id === note._id) {
        self.notes[i] = note;
      }
    }
  };

  self['delete'] = function (note) {
    var noteDeletePromise = $http['delete'](API_BASE + note._id);
    noteDeletePromise.then(function (response) {
      self.remove(response.data.note);
    });
    return noteDeletePromise;
  };

  self.remove = function (note) {
    for (var i = 0; i < self.notes.length; i++) {
      if (self.notes[i]._id === note._id) {
        self.notes.splice(i, 1);
        break;
      }
    }
  };
}
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

angular.module('notely').service('UsersService', ['$http', 'API_BASE', function ($http, API_BASE) {
  var UsersService = (function () {
    function UsersService() {
      _classCallCheck(this, UsersService);
    }

    _createClass(UsersService, [{
      key: 'create',
      value: function create(user) {
        var userPromise = $http.post(API_BASE + 'users', {
          user: user
        });
        userPromise.then(function (response) {
          console.log(response.data.user);
        });
        return userPromise;
      }
    }]);

    return UsersService;
  })();

  return new UsersService();
}]);
'use strict';

(function () {

  angular.module('notely.notes', ['ui.router', 'textAngular']).config(notesConfig);

  notesConfig['$inject'] = ['$stateProvider']; // preserves D.I. under minification
  function notesConfig($stateProvider) {
    $stateProvider
    // each url is a state

    .state('notes', {
      url: '/notes',
      resolve: {
        // see https://github.com/angular-ui/ui-router/wiki
        notesLoaded: ['NotesService', function (NotesService) {
          return NotesService.fetch();
        }]
      },
      templateUrl: '/notes/notes.html', // inserted wherever UI directive <UI-veiw> is located
      controller: NotesController
    }).state('notes.form', { // make this a child state of notes using .form
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

    $scope.save = function () {
      // Decide if we need to call create or update
      if ($scope.note._id) {
        NotesService.update($scope.note).then(function (response) {
          $scope.note = angular.copy(response.data.note);
        });
      } else {
        NotesService.create($scope.note, function (response) {
          $state.go('notes.form', { noteId: response.data.note._id });
        });
      }
    };

    $scope['delete'] = function () {
      NotesService['delete']($scope.note).then(function (response) {
        $state.go('notes.form', { noteId: undefined });
      });
    };

    $scope.buttonText = function () {
      if ($scope.note._id) {
        return 'Update';
      }
      return 'Save';
    };
  };
})();
//# sourceMappingURL=bundle.js.map
