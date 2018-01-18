angular.module('starter.services', ['ngResource'])

//.factory('Chats', function() {
//  // Might use a resource here that returns a JSON array
//
//  // Some fake testing data
//  var chats = [{
//    id: 0,
//    name: 'Ben Sparrow',
//    lastText: 'You on your way?',
//    face: 'img/ben.png'
//  }, {
//    id: 1,
//    name: 'Max Lynx',
//    lastText: 'Hey, it\'s me',
//    face: 'img/max.png'
//  }, {
//    id: 2,
//    name: 'Adam Bradleyson',
//    lastText: 'I should buy a boat',
//    face: 'img/adam.jpg'
//  }, {
//    id: 3,
//    name: 'Perry Governor',
//    lastText: 'Look at my mukluks!',
//    face: 'img/perry.png'
//  }, {
//    id: 4,
//    name: 'Mike Harrington',
//    lastText: 'This is wicked good ice cream.',
//    face: 'img/mike.png'
//  }];
//
//  return {
//    all: function() {
//      return chats;
//    },
//    remove: function(chat) {
//      chats.splice(chats.indexOf(chat), 1);
//    },
//    get: function(chatId) {
//      for (var i = 0; i < chats.length; i++) {
//        if (chats[i].id === parseInt(chatId)) {
//          return chats[i];
//        }
//      }
//      return null;
//    }
//  };
//})
  .factory('Resource', ['$resource', function($resource) {
    return function(url, params, methods) {
      var defaults = {
        update: { method: 'put', isArray: false },
        create: { method: 'post' }
      };

      methods = angular.extend(defaults, methods);

      var resource = $resource(url, params, methods);

      resource.prototype.$save = function() {
        if (this.id) {
          return this.$update();
        }
        else {
          return this.$create();
        }
      };

      return resource;
    };
  }])
  .factory('$api', ['Resource', function($resource) {
  var apiService = {};

  apiService.apiUrl = window.backendUrl;

  apiService.endpoint = function(path) {
    return "https://matchinguu.herokuapp.com" + '/' + path;
  };


  apiService.package = $resource(apiService.endpoint('box/:id'), { id: "@id" });
  //apiService.package = $resource(apiService.endpoint('box/?serialNumber=:serial'), { serial: "@serial" });
  apiService.userPackages = $resource(apiService.endpoint('box/?owner=:userId'), { userId: "@id" });
  apiService.packages = $resource(apiService.endpoint('box/'));

    apiService.actions = $resource(apiService.endpoint('actions/'));

  //apiService.notifications = $resource(apiService.endpoint('notifications/:id'), { id: "@id" }, { find: {
  //  method: 'GET',
  //  isArray: true,
  //  interceptor: {
  //    response: function(response) {
  //      return response.data;
  //    }
  //  }
  //}
  //});

  return apiService;
}]). service("user",[ function(){
  "use strict";
  var user = {id: '056f982297208abf', name : 'Mostafa', createdAt : '2017-12-15T23:00:00.000Z',
    identifier : 'mostafa', address : 'Alxander Pachman st. 13h'};
  return user;
}]);
