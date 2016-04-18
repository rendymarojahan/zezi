// Ionic Starter App
var fb = new Firebase("https://zezi.firebaseio.com");
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives' , 'ngIOS9UIWebViewPatch', 'angular.filter', 'firebase', 'pickadate', 'jett.ionic.filter.bar', 'ngCordova', 'ionic-timepicker', 'ngStorage'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $state, Auth, $cordovaStatusbar, $cordovaSplashscreen, $cordovaTouchID, $localStorage) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    setTimeout(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
                }
    }, 300);
    setTimeout(function () {
            if (typeof $localStorage.enableTouchID === 'undefined' || $localStorage.enableTouchID === '' || $localStorage.enableTouchID === false) {
                //should already be on login page
                $state.go("login");
            } else {
                $cordovaTouchID.checkSupport().then(function () {
                    $cordovaTouchID.authenticate("All users with a Touch ID profile on the device will have access to this app").then(function () {
                        $state.go("loginauto");
                    }, function (error) {
                        console.log(JSON.stringify(error));
                        $state.go("login");
                    });
                }, function (error) {
                    console.log(JSON.stringify(error));
                    $state.go("login");
                });
            }
    }, 750);
    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            if (error === "AUTH_REQUIRED") {
                $state.go("login");
            }
    });
  });
})