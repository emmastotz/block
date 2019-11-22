$(document).ready(function(){
    console.log("I am here at SIGN UP !");
    // Checks if two strings are the same value
    function passwordValid(a,b){
        return a===b ? true : false;
    };
    // A function for generating a post method to a user
    // TODO: Need to define a new route to create a new user to DB
    function postUser(userData) {
            $.post("/api/user", userData)
            .then(function(error, result){
                console.log("I am here at sign up with matching passwords !");
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
            console.log("The Password entered does not match the confirm password.");
            // $(".signup-validation").text("The Password entered does not match the confirm password.");
        };
    };
    $("#signup-button").on("click", function(){
        event.preventDefault();
        handleSignUp();
    });
});