var config = {
    apiKey: "AIzaSyC9pNO4Wn-cDkXf1iM721Bi5cOKfWprogE",
    authDomain: "project-one-41a36.firebaseapp.com",
    databaseURL: "https://project-one-41a36.firebaseio.com",
    projectId: "project-one-41a36",
    storageBucket: "project-one-41a36.appspot.com",
    messagingSenderId: "768894251614",
    appId: "1:768894251614:web:3a6383dbd6e22636d4facf"
}

firebase.initializeApp(config);

var database = firebase.database();

var username = "";

//============================This function will populate the leaderboard=============================
// needs code to get existing leaderboard data from firebase and to save taunt and gif to firebase 
//===========================================================================================
function displayGif() {

    var taunt = $("#taunt-input").val().trim();

    var queryURL = "https://api.giphy.com/v1/gifs/search?&q=" + taunt + "&limit=1&api_key=lN4gd7m0eEUwZ0iyDF5vSI6jCUW5ToiC";

    // AJAX call for the gif on the leaderboard
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        //set variable to hold data object
        var resultsObj = response.data;

        //create tds for taunt and gif
        var rankDisplay = $("<td>").text(1) //score from firebase?
        var userDisplay = $("<td>").text("username") //username from inial user input
        var scoreDisplay = $("<td>").text(25) //score from quiz
        var tauntDisplay = $("<td>").text($("#taunt-input").val().trim()); //user inputs on leaderboard
        var gifDisplay = $("<td>");

        //creat div for gif image
        var gifImg = $("<img>");
        //set source for image
        gifImg.attr({
            "src": resultsObj[0].images.fixed_height_small.url
        });

        //puts gif in gif dispaly
        gifDisplay.append(gifImg);

        //appends new row to table
        $("#leaderboard").append(rankDisplay);
        $("#leaderboard").append(userDisplay);
        $("#leaderboard").append(scoreDisplay);
        $("#leaderboard").append(tauntDisplay);
        $("#leaderboard").append(gifDisplay);

    });
};
//===================================================================================================

// when quiz is over, user types in taunt and hits button to populate the leaderboard 
$("#taunt-button").on("click", function () {
    event.preventDefault();

    displayGif();
});
//===================== end of leaderboard script=========================