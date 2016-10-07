var ngApp = angular.module('DemoApp', ['toastr']);

ngApp.controller('PageController', function($http, $scope, toastr){

  $scope.loggedInUser  = undefined;
  $scope.newpost = {};
  $scope.posts = [];
  $scope.auth={};

  $scope.httpget= function(route){
    return $http.get(route);
  };

  $scope.httppost = function(route, data){
    var req = {
      method: 'POST',
      url: route,
      headers: {
        'Content-Type': 'application/json',
        'authorization': $scope.loggedInUser
      },
      data: data
    };
    return $http(req);
  };


  $scope.httpget('/api/posts').then(function(res){
    var data = res.data;
    $scope.posts = data;
  }, function(err){
    console.log(err);
  });

	$scope.isLoggedIn = function(){
		return !!$scope.loggedInUser;
	};

  $scope.logIn = function() {
    $scope.httppost('/api/auth/login', $scope.auth).then(
      function(res){
        toastr.success('Welcome!');
        $scope.loggedInUser = res.data.UserId;
        $scope.auth={};
      }, function(err){
        toastr.error(err);
      }
    );
  };

  $scope.signUp = function() {
    $scope.httppost('/api/auth/signup', $scope.auth).then(
      function(res){
        toastr.success('Welcome!');
        $scope.loggedInUser = res.data.UserId;
        $scope.auth={};
      }, function(err){
        toastr.error(err);
      }
    );
  };

  $scope.initEdit=function(post) {
    post.editing = true;
  };

  $scope.finishEdit=function(post){
    $scope.httppost('/api/posts/'+post.PostId, {Message:post.Message}).then(
      function(res){
        post.editing = false;
        toastr.success('Post edited');
      }, function(err){
        toastr.error(err);
      }
    );
  };

  $scope.publishPost=function(){
    $scope.httppost('/api/posts/', $scope.newpost).then(
      function(res){
        toastr.success('New Post Created!');
        $scope.newpost = {};
        $scope.httpget('/api/posts').then(function(posts){
          $scope.posts = posts.data;
        });
      },
      function(err){
        toastr.error(err);
      }
    );
  };

  $scope.publishComment=function(post){
    $scope.httppost('/api/comments/', {PostId: post.PostId, Message: post.newcomment}).then(
      function(res){
        toastr.success('Comment Posted');
        post.newcomment = {};
        $scope.httpget('/api/posts').then(function(posts){
          $scope.posts = posts.data;
        });
      },
      function(err){
        toastr.error(err);
      }
    );
  };

});
