/**
 * Post Token to server
 */
function postToken(idToken) {
    fetch("/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "CSRF-Token": Cookies.get("XSRF-TOKEN"),
            "SameSite": "None",
            "Secure": "true"
        },
        body: JSON.stringify({
            idToken
        }),
    }).then(function(response) {
        console.log(response)
        return response.json();
    })
}




const getUserToken = (user) => {

    user.getIdToken().then(function(idToken) {
        /**
         * return idToken
         */
        postToken(idToken)



        /**
         * Sign Firebase User Out
         */
        firebase.auth().signOut().then(function() {
            console.log('Sign-out successful from Firebase.');

        }).catch(function(error) {
            console.log(error)
        });

    }).catch(function(error) {
        console.log(error)
    });
}

const handleSigninSuccess = (user, credential, redirectUrl) => {

    /**
     * Get User Token
     */
    user.getIdToken().then(function(idToken) {
            console.log(idToken)
                /**
                 * Call Post Token to server
                 */
            getUserToken(user)


        }

    )
    return false;
}



const getUser = async() => {
    const user = await firebase.auth().currentUser;
    console.log(user)
    return user
}
var uiConfig = {
    /**
     * Redirects to /profile after sign in.
     */
    'signInSuccessUrl': '/dashboard',
    'callbacks': {

        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            /**
             * Call Handle Signin Success
             */
            handleSigninSuccess(authResult.user, authResult.credential, redirectUrl)


            /**
             * Redirect to /dashboard
             */




            return true;;
        }

    },
    'signInOptions': [{
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: getEmailSignInMethod(),
        disableSignUp: {
            status: getDisableSignUpStatus()
        }
    }, {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
            size: getRecaptchaMode()
        }
    }, ],
    // Terms of service url.
    'tosUrl': 'https://www.google.com',
    'credentialHelper': CLIENT_ID && CLIENT_ID != 'YOUR_OAUTH_CLIENT_ID' ?
        'adminRestrictedOperation' : {
            status: getAdminRestrictedOperationStatus()
        }
};



const initApp = function() {
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
};