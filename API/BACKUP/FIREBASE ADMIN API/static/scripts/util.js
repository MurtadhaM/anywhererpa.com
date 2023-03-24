let students = [];

function setInputFilter(textbox, inputFilter, errMsg) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function(event) {
        textbox.addEventListener(event, function(e) {
            if (inputFilter(this.value)) {
                // Accepted value
                if (["keydown", "mousedown", "focusout"].indexOf(e.type) >= 0) {
                    this.classList.remove("input-error");
                    this.setCustomValidity("");
                }
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                // Rejected value - restore the previous one
                this.classList.add("input-error");
                this.setCustomValidity(errMsg);
                this.reportValidity();
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                // Rejected value - nothing to restore
                this.value = "";
            }
        });
    });
}

$(document).ready(function() {

        $(document).on('click', '#getAgentsBTN', function() {
            getAgents();
        });

        // INPUT VALIDATION
        setInputFilter(document.getElementById("ROLLID"), function(value) {
            return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 500);
        }, "Must be between 0 and 500");

        setInputFilter(document.getElementById("NAME"), function(value) {
            return /^[a-zA-Z ]*$/.test(value);
        }, "Must be a string");

        setInputFilter(document.getElementById("TITLE"), function(value) {
            return /^[a-zA-Z ]*$/.test(value);
        }, "Must be a string");

        setInputFilter(document.getElementById("CLASS"), function(value) {
            return /^[a-zA-Z ]*$/.test(value);
        }, "Must be a string");


    }




);



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

            if (message == "Student added successfully") {} else if (message == "Student updated successfully") {
                location.reload();
            } else if (message == "Student deleted successfully") {
                location.reload();

            } else {
                $('#ROLLID').css("border", "1px solid #f44336");

            }

        }

        ,


    }).showToast();
};