var config = {
    apiKey: "AIzaSyC9pNO4Wn-cDkXf1iM721Bi5cOKfWprogE",
    authDomain: "project-one-41a36.firebaseapp.com",
    databaseURL: "https://project-one-41a36.firebaseio.com",
    projectId: "project-one-41a36",
    storageBucket: "project-one-41a36.appspot.com",
    messagingSenderId: "768894251614",
    appId: "1:768894251614:web:3a6383dbd6e22636d4facf"
};

firebase.initializeApp(config);

var database = firebase.database();
var submitBtn = $(".submitBtn");
var userID = $(".userID");
var form = $(".enterUsername")
var user = false;

submitBtn.on("click", function (event) {
    event.preventDefault();
    //var test = database.ref().exist(userID).on('child_added', function (snapshot) {
    //    console.log(snapshot.size)
    //});
    var users = database.ref("users")
    if (userID.val() !== "") {
        var username = userID.val().trim();
        users.push({
            username
        })
        form.text("Username: " + username);
        form.append("<button class='btn btn-dark signOut'>Sign Out</button>");
        user = true;

    }

});


//============================This function will populate the leaderboard=============================
// needs code to get existing leaderboard data from firebase and to save taunt and gif to firebase
//===========================================================================================
function displayGif() {
    var taunt = $("#taunt-input")
        .val()
        .trim();

    var queryURL =
        "https://api.giphy.com/v1/gifs/search?&q=" +
        taunt +
        "&limit=1&api_key=lN4gd7m0eEUwZ0iyDF5vSI6jCUW5ToiC";

    // AJAX call for the gif on the leaderboard
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //set variable to hold data object
        var resultsObj = response.data;

        //create tds for taunt and gif
        var rankDisplay = $("<td>").text(1); //score from firebase?
        var userDisplay = $("<td>").text("username"); //username from inial user input
        var scoreDisplay = $("<td>").text(25); //score from quiz
        var tauntDisplay = $("<td>").text(
            $("#taunt-input")
                .val()
                .trim()
        ); //user inputs on leaderboard
        var gifDisplay = $("<td>");

        //creat div for gif image
        var gifImg = $("<img>");
        //set source for image
        gifImg.attr({
            src: resultsObj[0].images.fixed_height_small.url
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
}
//===================================================================================================

// when quiz is over, user types in taunt and hits button to populate the leaderboard
$("#taunt-button").on("click", function () {
    event.preventDefault();

    displayGif();
});
//===================== end of leaderboard script=========================

var opentdbURL = "https://opentdb.com/api.php?&type=multiple";
var queryParam = "";
var numQuestions = 0;
var difficulty = "";
var questionsArr = [];

$("#start").click(function () {
    $("#start").remove();
    triviaGame.currentQuestion();
});

$(document).on("click", "#reset", function () {
    $("#reset").remove();
    $("#main").empty();
    triviaGame.resetGame();
});

$(document).on("click", ".choiceButton", function (event) {
    triviaGame.buttonClick(event);
});

$(document).on("click", ".categoryButton", function () {
    var category = $(this).attr("data-category");
    queryParam = "q=" + category;
    $("#categoriesDiv").remove();
});

$("#numSubmit").on("click", function () {
    var numQuestions = $(this).val();
    queryParam += "&amount=" + numQuestions;
    $("#numQuestionsDiv").remove();
});

$(".difficultyButton").on("click", function () {
    var difficulty = $(this).attr("data-difficulty");
    queryParam += "&difficulty=" + difficulty;
    $("#difficultyDiv").remove();
});

$.ajax({
    url: opentdbURL + queryParam,
    method: "GET"
}).then(function (response) {
    for (var i = 0; i < response.results.length; i++) {
        questionsArr.push(response.results[i]);
        questionsArr[i].question = response.results[i].question;
        randAnswerPos = Math.floor(Math.random() * 4);
        questionsArr[i].answer = response.results[i].correct_answer;
        // questionsArr[i].choices[randAnswerPos] = questionsArr[i].answer;
        for (var j = 0; j < 3; j++) {
            questionsArr[i].choices.push(response.results.incorrect_answers[j]);
        }
        questionsArr[i].choices.splice(randAnswerPos, 0, questionsArr[i].answer);
    }
});

// questionsArr = [{

//     question : "What is my favorite color?",
//     choices : ["Red", "Green", "Yellow", "Blue"],
//     answer: "Blue"} , {

//     question: "Which of these artists have I not seen perform live?",
//     choices: ["Aphex Twin", "Boards of Canada", "Radiohead", "Underworld"],
//     answer: "Boards of Canada"} , {

//     question: "What was the topic of my senior project at UCSC?",
//     choices: ["Catalan Numbers", "Fermat's Little Theorem", "Fibonacci Numbers", "Euclidean Geometry"],
//     answer: "Catalan Numbers"} , {

//     question: "What is my favorite movie?",
//     choices: ["The Sting", "The Usual Suspects", "The Shawshank Redemption", "American Beauty"],
//     answer: "The Usual Suspects"} , {

//     question: "What is the worst movie I've seen this year?",
//     choices: ["In the Shadow of the Moon", "Mazes and Monsters", "Bill and Ted's Excellent Adventure", "El Camino"],
//     answer: "Mazes and Monsters"} , {

//     question: "What is my favorite anime series?",
//     choices: ["Death Note", "Fullmetal Alchemist", "Cowboy Bebop", "Dragonball Z"],
//     answer: "Cowboy Bebop"} , {

//     question: "What foreign language did I take in high school?",
//     choices: ["Spanish", "Japanese", "French", "German"],
//     answer: "French"} , {

//     question: "What is my favorite team in the English Premier League?",
//     choices: ["Chelsea", "Manchester City", "Liverpool", "Arsenal"],
//     answer: "Liverpool"} , {

//     question: "What musical instrument did I play when I was growing up?",
//     choices: ["Guitar", "Piano", "Violin", "Drums"],
//     answer: "Piano"}]

var triviaGame = {
    triviaQuestions: questionsArr,
    numberQuestion: 0,
    timeLeft: 30,
    correctAnswers: 0,
    incorrectAnswers: 0,
    unansweredQs: 0,

    gameTimer: function () {
        $("#ticker").html(triviaGame.timeLeft + " seconds remaining");
        triviaGame.timeLeft--;
        if (triviaGame.timeLeft <= 0) {
            triviaGame.outOfTime();
        }
    },
    currentQuestion: function () {
        $("#main").empty();
        timer = setInterval(triviaGame.gameTimer, 1000);
        $("#QUESTION").html(
            "<h3>" + questionsArr[triviaGame.numberQuestion].question + "</h3>"
        );

        for (
            var i = 0;
            i < questionsArr[triviaGame.numberQuestion].choices.length;
            i++
        ) {
            $("#main").append(
                "<button class= 'choiceButton' data-choice= '" +
                questionsArr[triviaGame.numberQuestion].choices[i] +
                "'>" +
                questionsArr[triviaGame.numberQuestion].choices[i] +
                "</button>" +
                "<br></br>"
            );
        }
    },

    buttonClick: function (event) {
        triviaGame.resetTimer();
        if (
            $(event.target).data("choice") ===
            questionsArr[triviaGame.numberQuestion].answer
        ) {
            triviaGame.correctAns();
        } else {
            triviaGame.wrongAns();
        }
    },

    nextQuestion: function () {
        triviaGame.resetTimer();
        triviaGame.numberQuestion++;
        triviaGame.currentQuestion();
    },
    outOfTime: function () {
        triviaGame.resetTimer();
        triviaGame.unansweredQs++;
        $("#ticker").html("<p> </p>");
        $("#main").html("<h4> OOPS YOU RAN OUT OF TIME </h4>");
        if (triviaGame.numberQuestion === questionsArr.length - 1) {
            setTimeout(triviaGame.finalScore, 2000);
        } else {
            setTimeout(triviaGame.nextQuestion, 2000);
        }
    },

    correctAns: function () {
        triviaGame.resetTimer();
        $("#ticker").html("<p> </p>");
        triviaGame.correctAnswers++;
        $("#main").html("<h4> CORRECT! </h4>");
        if (triviaGame.numberQuestion === questionsArr.length - 1) {
            setTimeout(triviaGame.finalScore, 2000);
        } else {
            setTimeout(triviaGame.nextQuestion, 2000);
        }
    },

    wrongAns: function () {
        triviaGame.resetTimer();
        triviaGame.incorrectAnswers++;
        $("#ticker").html("<p> </p>");
        $("#main").html("<h4> INCORRECT! </h4>");
        if (triviaGame.numberQuestion === questionsArr.length - 1) {
            setTimeout(triviaGame.finalScore, 2000);
        } else {
            setTimeout(triviaGame.nextQuestion, 2000);
        }
    },

    finalScore: function () {
        $("#QUESTION").empty();
        $("#main").html("COMPLETE!");
        $("#main").append("<p> </p>" + "Correct: " + triviaGame.correctAnswers);
        $("#main").append("<p> </p>" + "Incorrect: " + triviaGame.incorrectAnswers);
        $("#main").append("<p> </p>" + "Unanswered: " + triviaGame.unansweredQs);
        $("#main").append(
            "<p> </p>" + "<button id= 'reset'>" + "Reset" + "</button>"
        );
    },
    resetGame: function () {
        correctAnswers = 0;
        incorrectAnswers = 0;
        unansweredQs = 0;
        triviaGame.resetTimer();
        triviaGame.numberQuestion = 0;
        triviaGame.currentQuestion();
    },

    resetTimer: function () {
        clearInterval(timer);
        triviaGame.timeLeft = 30;
    }
};
