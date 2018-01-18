angular.module('starter.controllers', [])

  .config(function($ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
  })
.controller('HomeCtrl', function($scope, $state, user, $api) {
  "use strict";
  $scope.scanOrList = null;
  $scope.selectOptions = [ 'From List', 'Scan Code'];
  $scope.handleAction = function(action, param){
    if(action == 'send'){
      console.log(param);
      if(param == 'Scan Code'){
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            //alert("We got a barcode\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
            $api.actions.save({boxId : result.text , senderId : user.id, receiverId: "ae410d530a4eca87", status : "Pending Receive"});
            alert("Sent");

          },
          function (error) {
            alert("Scanning failed: " + error);
          },
          {
            preferFrontCamera : true, // iOS and Android
            showFlipCameraButton : true, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: true, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
          }
        );
      }else if(param == 'From List'){
        $state.go('tab.packages');
      }
    } else if(action == 'receive') {
      cordova.plugins.barcodeScanner.scan(
        function (result) {
          alert("We got a barcode\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
          $scope.package = $api.package.get({action : "receive",serialNumber: result.text, userId : user.id},
            function(data, error){
              console.log(data);
              console.log(error);
              $state.transitionTo('tab.packages', null, { inherit: false, reload: true, notify:true});
            }
          );
          console.log("Done");
          $state.go('tab.packages')
        },
        function (error) {
          alert("Scanning failed: " + error);
        },
        {
          preferFrontCamera : true, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: true, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt : "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
        }
      );
    }
  }

})

.controller('PackagesCtrl', function($scope, $api, user, $stateParams,$state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  //$scope.chats = Chats.all();
  //$scope.remove = function(chat) {
  //  Chats.remove(chat);
  //};

  var groups = $api.packages.query({ owner : user.id
    },
    function (data) {
      $scope.packages = groups;
    });
})

.controller('PackageDetailCtrl', function($scope, $stateParams, $api, $ionicModal, user, $state) {
  $scope.package = $api.package.get({id: $stateParams.packageId}, function(data){
    $scope.adjustedWidth = data.length * 1.14;
    $scope.left = data.width * 2.06;
    $scope.top = data.height * 1.90;
  });

  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.send = function(receiver) {
    //$scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
    $api.actions.save({boxId : $scope.package.id , senderId : user.id, receiverId: "ae410d530a4eca87", status : "Pending Receive"});
    $scope.modal.hide();
    $state.transitionTo('tab.packages', null, { inherit: false, reload: true, notify:true});
    //$state.go('tab.packages',{reload: true}, { reload: true })
  };

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
