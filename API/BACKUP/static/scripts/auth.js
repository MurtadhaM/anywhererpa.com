        // FirebaseUI config.

        window.addEventListener('load', function() {
            initApp();
        });

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
                },
                body: JSON.stringify({
                    idToken
                }),
            }).then(function(response) {
                console.log(response)
                return response.json();
            })
        }
        var uiConfig = {
            /**
             * Redirects to /profile after sign in.
             */
            // 'signInSuccessUrl': '/profile',
            'callbacks': {
                'signInSuccess': function(user, credential, redirectUrl) {
                    console.log(user)
                    user.getIdToken().then(function(idToken) {
                        console.log(idToken)
                            /**
                             * Call Post Token to server
                             */
                        postToken(idToken);

                    });
                    return true;
                },
                'signInFailure': function(error) {
                    console.log('signInFailure', error);
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
                firebaseui.auth.CredentialHelper.GOOGLE_YOLO : firebaseui.auth.CredentialHelper.NONE,
            'adminRestrictedOperation': {
                status: getAdminRestrictedOperationStatus()
            }
        };



        const initApp = function() {
            // Initialize the FirebaseUI Widget using Firebase.
            var ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start('#firebaseui-auth-container', uiConfig);
        };