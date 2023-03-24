const addActionListeners = () => {
    const addClientBtn = document.getElementById('addClient');
    addClientBtn.addEventListener('click', () => {
        const popup = document.querySelector('.popup');
        popup.classList.add('active');
    });


}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#addClient').addEventListener('click', function() {
        document.querySelector('.popup').innerHTML = POPUP;
        /**
         * Close popup Action
         */
        const closeBtn = document.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            const popup = document.querySelector('.popup');
            popup.innerHTML = '';
        });
    });

    addActionListeners();
    const POPUP = `
    <div id="popup"     <div class="popupWrap">
    <div class="popup active">
<div class="popup-inner">
<button class="close-btn">
<i class="fa fa-close" style="font-size:36px"></i>
</button>
<div class="popupWrap">
<div class="productSummary">
<h3 class="productSummaryLeft">Add New Client</h3>
<div class="productSummaryRight newUserSwitch">
    <h3>New client?</h3>
    <input type="radio" name="rdo" id="yes" checked=""><input type="radio" name="rdo" id="no">
    <div class="switch">
        <label class="switchLabel" for="yes">Yes</label><label class="switchLabel" for="no">No</label><span></span>
    </div>
</div>
</div>
<div class="addNewOrderWrap">
<div class="addNewOrderForm">
    <div class="orderDetails">
        <div class="input-group">
            <input placeholder="Client name" class="orderDetailsInput orderDetailsInputHalf" required="" value="" id="name" type="text"><input placeholder="Phone number" class="orderDetailsInput orderDetailsInputHalf" required="" value="" id="phone" type="phone">
        </div>
        <div class="input-group">
            <input type="textarea" required="" value="" class="orderDetailsInput" id="email" placeholder="Email Address">
            <input type="textarea" required="" value="" class="orderDetailsInput" id="password" placeholder="Password">


        </div>
        <div class="input-group">
            <input class="orderDetailsInput orderDetailsInputHalf" required="" value="" placeholder="password" id="password" type="password"><input class="orderDetailsInput orderDetailsInputHalf" required="" value="" placeholder="City" id="city" type="text">
        </div>
        <div class="input-group">
            <input class="orderDetailsInput orderDetailsInputHalf" required="" value="" placeholder="State" id="state" type="text"><input placeholder="Postal code" class="orderDetailsInput orderDetailsInputHalf" required="" value="" id="zipcode" type="text">
        </div>
        <div>
            
        </div>
    </div>
    
</div>
</div>
<div class="submitWrap">

<div class="submitNewOrder">
    <button class="submitNewOrderBtn" onclick="AddClient()">
<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="AddCircleOutlineRoundedIcon">
<path d="M12 7c-.55 0-1 .45-1 1v3H8c-.55 0-1 .45-1 1s.45 1 1 1h3v3c0 .55.45 1 1 1s1-.45 1-1v-3h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V8c0-.55-.45-1-1-1zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg><span class="addOrderText">Add</span>
</button>
</div>
</div>
</div>
</div></div>
</div></div>`

    /**
     * ADD POPUP
     */
    const togglePopup = () => {
        if ($('.popup').is(':visible')) {
            $('.popupWrap').hide();
        } else {
            $('.popupWrap').show();
        }

        $('.popupWrap').append(POPUP);
        $('.popupWrap').show();
    }




    document.addEventListener('DOMContentLoaded', function() {
        addClientBtn.addEventListener('click', () => {
            const popup = document.querySelector('.popup');
            popup.classList.add('active');
        });




        $(document).on('load', function() {
            $('.popupWrap').hide();
            $('#addClient').click(function() {
                $('.popupWrap').append(POPUP);
                togglePopup();
            });

            $('.close-btn').click(function() {
                $('.popupWrap').hide();
                togglePopup();
            });

            $('.addOrder').click(function() {
                $('.popupWrap').show();
            });

            //set up links
            populateNav();
            $('.popupWrap').hide();

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
                $('.popupWrap').hide();
            });
            $('.addOrder').click(function() {
                $('.popupWrap').show();
            });


        });

    });


    $(document).ready(function() {
        $('.submitNewOrderBtn').on('click', function() {
            AddClient();
        });
    });
    const AddClient = () => {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zipcode = document.getElementById('zipcode').value;
        const newClient = {
            name,
            phone,
            email,
            address,
            city,
            state,
            zipcode
        };

        fetch('/clients/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newClient)
        }).then((response) => {

            if (response.status === 200) {
                console.log('client added');
                window.location.href = "/clients";
            } else {
                console.log('client not added');
            }
        });
    };



});