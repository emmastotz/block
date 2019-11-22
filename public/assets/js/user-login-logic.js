$(document).ready(function(){
    console.log("I am here at the user LOGIN !");
    function passwordValid(a,b){
        return a===b ? true : false;
    };
    //Handles the sign-up validation
    function handleLogin(){
        let passwordStoredInDB;
        let userId;
        let userNameInput = $("#email-input").val().trim();
        let passwordInput = $("#password-input").val().trim();
        $.get("/api/login/" + userNameInput)
        .then(function(result){
            passwordStoredInDB = result[0].password;
            userId = result[0].id;
            if(passwordValid(passwordStoredInDB,passwordInput)){                
                // The retrieved ID of the user is saved in session storage
                // This will later be used to handle matching and saving user answers to the survey
                sessionStorage.setItem("user_id",userId);
                window.location.replace("/index");
            } else {
                console.log("The user/password entered is invalid for the given user/password.");
                // $("#login-validation").text("The user/password entered is invalid for the given user/password.");
            };
        }).catch(function(err){
            console.log("The user/password entered is invalid for the given user/password.");
            // $("#login-validation").text("The user/password entered is invalid for the given user/password.");
            throw err;
        });
    };
    // User login on click function
    $("#login").on("click", function(){
        event.preventDefault();
        handleLogin();
    });
});