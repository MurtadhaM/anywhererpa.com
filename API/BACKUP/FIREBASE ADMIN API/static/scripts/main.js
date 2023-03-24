const createNavItem = (link, title, icon) => {
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

/**
 * Create the navigation bar
 */
function createNavBar() {
    const navBar = document.querySelector('.SidebarList');
    const navBarItems = [
        { name: 'Dashboard', link: 'dashboard' },
        { name: 'Orders', link: 'orders' },
        { name: 'Products', link: 'products' },
        { name: 'Customers', link: 'customers' },
        { name: 'Settings', link: 'settings' },
        { name: 'Admin', link: 'admin' },
        {
            name: 'Logout',
            link: 'logout'


        }
    ];

}




const PopulateNavBar = () => {
    const navBar = document.querySelector('.SidebarList');
    const navBarItems = [
        { name: 'Dashboard', link: 'dashboard', icon: 'fa-tachometer-alt' },
        { name: 'Clients', link: 'clients', icon: 'fa-users' },
        { name: 'Documents', link: 'documents', icon: 'fa-file' },
        { name: 'Settings', link: 'settings', icon: 'fa-cog' },
        { name: 'Admin', link: 'admin', icon: 'fa-user-shield' },
        { name: 'Logout', link: 'logout', icon: 'fa-sign-out-alt' }
    ];

    navBarItems.forEach((item) => {
        console.log(item);
        navBar.innerHTML += createNavItem(item.link, item.name, item.icon)
    })
}


$(document).on('DOMContentLoaded', function() {
    $('#popup').hide();
    $('#addClient').click(function() {
        $('#popup').show();
    });
    $('.close-btn').click(function() {
        $('#popup').hide();
    });
    setupActionListeners();
    PopulateNavBar();
});


document.addEventListener('DOMContentLoaded', function() {
    PopulateNavBar();
});




/**
 * Logout the user
 * */
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        window.location.href = "/login"
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