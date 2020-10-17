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
        auth2.signIn();
        $('body').removeClass('anon');
    }
};

var userChanged = function (user) {
    console.log('User now: ', user);
    googleUser = user;
    googleUserName = user.getBasicProfile().getName();
    document.getElementById('signInButton').classList.add("loggedin")
    document.getElementById('signInLabel').innerText = user.getBasicProfile().getName();
    document.getElementById('signInPic').src = user.getBasicProfile().getImageUrl();
    makeVisit(user.getId());
    loadVisited(user.getId(), $(".toc"));
};    