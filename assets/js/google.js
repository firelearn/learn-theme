var auth2; // The Sign-In object.
var googleUser; // The current user.
var googleUserName;

var appStart = function() {
    gapi.load('auth2', initSigninV2);
};
var initSigninV2 = function() {
    auth2 = gapi.auth2.init({
        client_id: '1029780837049-00a0kk6usg29br5ibv67bgoh9rs9mg42.apps.googleusercontent.com',
        scope: 'profile'
    });
    auth2.attachClickHandler(document.getElementById('signInButton'));
    auth2.currentUser.listen(userChanged);
    // Sign in the user if they are currently signed in.
    if (auth2.isSignedIn.get() == true) {
      console.log("Already signed in");
      auth2.signIn();
      $('body').addClass('signedIn');
      $('body').removeClass('unchecked');
      $('body').removeClass('anon');
    }
};

var userChanged = function (user) {
    console.log('User now: ', user);
    googleUser = user;
    googleProfile = googleUser.getBasicProfile();
    if(googleProfile){
      googleUserName = googleProfile.getName();
      console.log(`Signed in as ${googleUserName}`);
      document.getElementById('signInButton').classList.add("loggedin")
      document.getElementById('signInLabel').innerText = user.getBasicProfile().getName();
      document.getElementById('signInPic').src = user.getBasicProfile().getImageUrl();
      $('body').addClass('signedIn');
      $('body').removeClass('anon');
      $('body').removeClass('unchecked');
      let token = user.getAuthResponse().id_token;
      visiting.makeVisit(token);
      learntrack_quiz.userJwt = token;
      visiting.loadVisited(token, $(".toc"));
    }else{
      console.log("Not currently signed in");
      $('body').addClass('anon');
      $('body').removeClass('unchecked');
      $('body').removeClass('signedIn');
    }
};    