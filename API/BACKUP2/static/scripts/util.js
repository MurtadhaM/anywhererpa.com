$(document).ready(function() {



    const notifyToast = (message, type) => {

        if (message == "Student added successfully") {
            width = "100%";
            background = "#00d1b2";
        } else {
            background = "#ff3860";

        }

        Toastify({

            text: message,
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                background: background,
                color: "red",

            },
            callback: () => {

                console.log("toast closed");


            }

            ,
        }).showToast();
    };


});