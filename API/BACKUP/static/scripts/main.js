let SidebarMenu = (link, title, icon) => {
    return `
    <a class="sidebar-link" href="${link}">
    <li class="SidebarRow">
        <div class="RowIcon">
        <i class="fas ${icon}" style="color: #ff0033"></i>
        </div>
        <div class="RowTitle">${title}</div>
    </li>
</a>
    `
}

function loggededInUserUpdateNav(email) {
    $('.userLogged').innerHTML = email;
}

function populateNav() {
    let links = ['Dashboard', 'Clients', 'Documents', 'Settings', 'Profile', 'Admin', "Logout"];
    let icons = ['fa-tachometer-alt', 'fa-users', 'fa-file-alt', 'fa-cog', 'fa-sharp fa-solid fa-user', 'fa-sharp fa-solid fa-user', 'fa-sharp fa-solid fa-right-from-bracket'];
    let link = ['/dashboard', '/clients', '/documents', '/settings', '/profile', 'admin', '/logout'];
    let sidebar = $('.SidebarList');

    /**
     *  Populate Sidebar
     */
    for (var i = 0; i < links.length; i++) {
        sidebar.append(SidebarMenu(link[i], links[i], icons[i]));
    }

}
// LoadedDom 

$(document).on('DOMContentLoaded', function() {
    populateNav()
    $('#popup').hide();
    $('.addOrder').click(function() {
        $('#popup').show();
    });
    $('.close-btn').click(function() {
        $('#popup').hide();
    });

    try {
        if (Cookies.get('user') == undefined) {
            console.log("user is not signed in");

        } else {
            console.log("user is signed in");
            let email = JSON.parse(Cookies.get('user')).email;
            let userLogged = document.querySelector('.userLogged');
            $('.userLogged').text('Logged as: ' + email);
        }

    } catch (err) {
        console.log(err);

    }

});

$(document).on('load', function() {



    //set up links
    populateNav();
    $('#popup').hide();

    //set up action listeners
    setupActionListeners();
    //check if user is logged in AXIOS
    axios.get('/auth/user').then((response) => {
        console.log(response.data);
        if (response.data.user) {
            console.log("user is signed in");
        } else {
            console.log("user is not signed in");
            window.location.href = "/";
        }
    }).catch((error) => {
        console.log(error);
    });

    $('.close-btn').click(function() {
            $('#popup').hide();
        }


    );

    $('.addOrder').click(function() {
        $('#popup').show();
    });



});


/**
 *  Populate the links in the navigation bar
 */


/** 
 * 
 * Setup Action Listeners
 * */
function setupActionListeners() {
    document.getElementById("Dashboard").addEventListener("click", logout);
}

/**
 * Logout the user
 * */
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        window.location.href = "index.html";
    }).catch((error) => {
        // An error happened.
        console.log(error);
    });
}



/**
 * Toggle the popoup
 */


function togglePopup() {
    $('.popup').show();
}
$('.close-btn').click(function() {
    $('.popup').hide();
});



/**
 *  Change the Nav Bar based on the page
 */
function Check_Auth() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("user is signed in");

            // }
        } else {
            // No user is signed in.
            console.log("user is not signed in");
            window.location.href = "index.html";
        }
    });
}