$(document).ready(function(){
    // Checks if two strings are the same value
    function passwordValid(a,b){
        return a===b ? true : false;
    };
    // A function for generating a post method to a user
    // TODO: Need to define a new route to create a new user to DB
    function postUser(userData) {
            $.post("/api/user", userData)
            .then(function(error, result){
                window.location.href="/";
            });
    };
    //Handles the sign-up validation
    function handleSignUp(){
        var emailInput = $("#new-email").val().trim();
        var passwordInput = $("#new-password").val().trim();
        var passwordCheckInput = $("#confirm-password").val().trim();
        // Check to see if the password entered matches the confirm password
        if(passwordValid(passwordInput,passwordCheckInput)){
            // Creates a new user in the database
            var user = {
            email: emailInput,
            password: passwordInput
            };
            // Console logs the current user object for sanity checking
            postUser(user);                    
        }else{
            $(".error-message").text("The passwords do not match. Please try again.");
        };
    };
    $("#signup-button").on("click", function(){
        event.preventDefault();
        handleSignUp();
    });
});