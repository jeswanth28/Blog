var App = angular.module('BlogApp', ['ui.router', 'ngMaterial', 'ngMessages', 'firebase']);

App.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '',
            controller: 'BlogController',
            templateUrl: 'index.html'
        })
        .state('home.login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'BlogController'
        })
        .state('dashboard.posts', {
            url: '/posts',
            templateUrl: 'views/posts.html',
            controller: 'BlogController',
        resolve: {
            security: ['$q', function($q) {


                



            }]
        }
        })
        .state('dashboard', {
            url: '',
            templateUrl: 'views/dashboard.html',
            controller: 'BlogController',
        resolve: {
            security: ['$q', function($q) {

                
                



            }]
        }
        })

    .state('dashboard.create', {
        url: '/createpost',
        templateUrl: 'views/createpost.html',
        controller: 'BlogController',
        resolve: {
            security: ['$q', function($q) {

                
                



            }]
        }
    })

    .state('home.register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'BlogController'
    })
    $urlRouterProvider.otherwise("/login");
}])

App.service('FireBaseApp', function() {
   var config = {
        apiKey: "AIzaSyDiMNqIAT17Fx4KXv-uz06k2Gj9pv202yQ",
        authDomain: "blog-81846.firebaseapp.com",
        databaseURL: "https://blog-81846.firebaseio.com",
        storageBucket: "blog-81846.appspot.com",
        messagingSenderId: "735818920804"
    };
    this.firebaseInstance = firebase.initializeApp(config);
})

App.controller('BlogController', function($scope, $state, FireBaseApp,$timeout) {
    // import FBApp from '/blogs';
    $scope.postImage = [];
    $scope.postDetails = {
        context: '',
        image: '',
        comments: []
    }

    $scope.register = function() {
        $state.go('home.register');
    }
    $scope.login = function() {
        $state.go('home.login');
    } 
    $scope.callRegisterApi = function() {
        FireBaseApp.firebaseInstance.auth().createUserWithEmailAndPassword($scope.userDetails.email, $scope.userDetails.password)
            .then(function(data) {
                $timeout(function(){
                    $scope.message = "User Created Successfully";
                },0);
                
            })
            .catch(function(error) {
                // Handle Errors here.
                console.log(error);
                $timeout(function(){
                $scope.message = error.message;
            },0);
               
                // ...
            });
    }

    $scope.requestLoginApi = function() {
        FireBaseApp.firebaseInstance.auth().signInWithEmailAndPassword($scope.userDetails.email, $scope.userDetails.password)
            .then(function(data) {
                $scope.message="Successfully Logged in";
               $scope.getDatabase();
            })
            .catch(function(error) {
                     $timeout(function(){
                $scope.message = error.message;
            },0);
            })
    }
    var file;
    $scope.imageUpload = function(element) {
      

        $scope
            .$apply(function(scope) {
                file = element.files[0];
                
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);


            });
    }

    $scope.imageIsLoaded = function(e) {
        $scope
            .$apply(function() {
                $scope
                    .postImage
                    .push(e.target.result);
            });
    }
    
    var storageRef = FireBaseApp.firebaseInstance.storage().ref();

    $scope.requestDatabaseAPI = function() {
        if($scope.postImage.length==0){
            $scope.message="Add Image";
        }
        else if($scope.postDetails.context ==''){
            $scope.message="Add Description";
        }
        else{
        var metadata = {
            contentType: file.type
        }

        storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
            storageRef.child('images/' + file.name).getDownloadURL().then(function(url) {
                $scope.postDetails.image = url;
                $scope.pushToDatabase();
            }).catch(function(error) {})
        })
    }

    }
    $scope.pushToDatabase = function() {
        FireBaseApp.firebaseInstance.database().ref('blogs/').push($scope.postDetails)
            .then(function(data) {
                $scope.getDatabase();
            })
            .catch(function(error) {
                console.log(error);
            });
    }
   // $scope.arrayList = [];
    $scope.getDatabase = function() {
        FireBaseApp.firebaseInstance.database().ref('blogs').once("value", function(snapshot) {
            $timeout(function(){
                list = snapshot.val();
                if(list != null){
            $scope.arrayList = $.map(list, function(value, index) {
                return [value];
            });
        }
                $state.go('dashboard.posts');
            },10);

        },function(error){
            $timeout(function(){
                $scope.message="error.message";
            },0);
        });

    }
    $scope.signOutFunction=function(){
        FireBaseApp.firebaseInstance.auth().signOut().then(function(response){
           
            //$scope.message="Successfully Logged out "
        })
        .catch(function(error){
            console.log(error);
        })
    }
});
App.controller('PostsController', function($scope, $state, FireBaseApp) {

    });

(function() {
        'use strict';

        App
                .run(runBlock);

        /** @ngInject */
        function runBlock($rootScope, $http, $anchorScroll,FireBaseApp,$state) {
               
                
                //console.log($rootScope.franchiseType);
                $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, error) {

                    FireBaseApp.firebaseInstance.auth().onAuthStateChanged(function(user) {
                         
                    if (user) {
                        // User is signed in.
                       
                    } else {
                        // No user is signed in.
                if((toState.url != '/register') && (toState.url != '/login') ){
                    event.preventDefault();
                       $state.go('home.login');
                      
                   }
                        
                    }
                });
                        
                });

            
        }
})();
