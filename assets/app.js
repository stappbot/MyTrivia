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

var db = firebase.firestore();
var user;
var usernameFromLocalStorage;

var logInBtn = $(".logIn");
var userAuthText = $(".userAuth");

logInBtn.on("click", function(event) {
  event.preventDefault();
  logIn();
});

function userLog() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      userAuthText.text("");
      userAuthText.append(
        "<div class='userLoggedIn'> User: " +
          user.displayName +
          "<button class='signOut btn btn-outline-light'>Sign Out</button>" +
          "</div>"
      );
    } else {
    }
  });
}

userLog();
// $(document).on("click", "#joinButton", function () {
//     console.log("ih")
//     firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
//             $("#options").text("");
//             $("#options").append(
//                 "<div class='userLoggedIn'> User: " +
//                 name +
//                 "<button class='signOut btn btn-outline-light'>Sign Out</button>" +
//                 "</div>"
//             )
//         } else {
//             logIn();
//         }
//     })
// });

var logIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  userAuthText.text("");
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      const id = user.uid;
      const name = user.displayName;
      const email = user.email;

      console.log(name);
      userAuthText.append(
        "<div class='userLoggedIn'> User: " +
          name +
          "<button class='signOut btn btn-outline-light'>Sign Out</button>" +
          "</div>"
      );

      console.log(user);
      db.collection("users")
        .where("id", "==", id)
        .get()
        .then(function(querySnapshot) {
          if (querySnapshot.size === 0) {
            db.collection("users")
              .add({
                name: name,
                id: id,
                email: email
              })
              .then(function(localId) {
                console.log("adding new user");
                localStorage.setItem("id", id);
                console.log(localStorage.getItem("id"));
              })
              .catch(function(error) {
                console.log("Error: ", error);
              });
          } else {
            console.log("logging in existing user");
            localStorage.setItem("id", id);
          }
        });
    })
    .then(function() {
      // var nameStorage = localStorage.getItem("name");
      console.log("SHOULD NOT FIRE FIRST");
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;

      console.log(errorCode, errorMessage, email, credential);
    });
};

var loggedInUser = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user);
    } else {
      window.localStorage.clear();
    }
  });
};

$(document).on("click", ".signOut", function(event) {
  event.preventDefault();
  firebase
    .auth()
    .signOut()
    .then(
      function() {
        console.log("Signed Out");
        document.location.reload();
      },
      function(error) {
        console.error("Sign Out Error", error);
      }
    );
  loggedInUser();
});

$("#share").on("click", function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user);
    } else {
      logIn();
    }
  });
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
  }).then(function(response) {
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
$("#taunt-button").on("click", function() {
  event.preventDefault();

  displayGif();
});
//===================== end of leaderboard script=========================

var opentdbURL = "https://opentdb.com/api.php?&type=multiple";
var queryParam = "";
var difficulty = "";
var questionsArr = [];
var questionsLimit = 0;
var categoryChosen = false;
var questionsLimitChosen = false;
var difficultyChosen = false;
var openTDBArr = [];
// var joinButton = null ;

$(document).ready(function() {
  // $("#joinDiv").remove();
});

//START GAME!
$("#start ").click(function () {
    var queryURL = opentdbURL + queryParam;
    console.log(queryURL);
    //AJAX call to openTDB API, using queryParam to find the specific trivia quiz(object array)
    // send questions to questionsArr = [{question, choices, answer}...{}]
    // push incorrect answers into questionsArr[i].choices and then splice the correct answer into it at a random position
    // this way the correct answer will not be in the same position for each question
    if (difficultyChosen && questionsLimitChosen && categoryChosen) {
        $("#start").remove();
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            if (response.results.length > 0) {
                console.log(response.results.length);
                openTDBArr = response.results;
                console.log(openTDBArr);
                formatArray();
                triviaGame.currentQuestion();
            }
            else{
                document.location.reload(true);
            }
        });
    }
    if (!difficultyChosen) {
        $("#difficultyDiv").append("Please choose difficulty");
    }
    if (!categoryChosen) {
        $("#categoriesDiv").append("Please choose a category");
    }
    if (!questionsLimitChosen) {
        $("#number-input").append("Please enter a number of questions");
    }
});

function formatArray() {
    for (var i = 0; i < openTDBArr.length; i++) {
        openTDBArr[i].choices = openTDBArr[i].incorrect_answers;
        openTDBArr[i].answer = openTDBArr[i].correct_answer;

        randAnswerPos = Math.floor(Math.random() * 4);
        openTDBArr[i].choices.splice(randAnswerPos, 0, openTDBArr[i].answer);
        console.log(openTDBArr[i]);
    }
    questionsArr = openTDBArr;
}

function saveQuiz(score) {
  console.log("saveQuiz Test");
  var quizObj = questionsArr;
  var uID = localStorage.getItem("id");
  db.collection("quizzes")
    .add({
      quiz: quizObj,
      userID: uID,
      user: name,
      score: score
    })
    .then(function() {
      //just in case
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorCode, errorMessage);
    });
}

//RESET GAME!
$(document).on("click", "#reset", function() {
  $("#reset").remove();
  $("#main").empty();
  triviaGame.resetGame();
});

//Game Running, user guesses an answer
$(document).on("click", ".choiceButton", function(event) {
  triviaGame.buttonClick(event);
});

//Pre-Game: user picks a catagory for trivia questions
// modifies queryParam accordingly
$(document).on("click", ".categoryButton", function() {
  var category = $(this).attr("data-category");
  queryParam += "&category=" + category;
  $("#categoriesDiv").remove();
  categoryChosen = true;
  console.log(queryParam);
});

//Pre-game: User chooses difficulty for trivia questions-- easy/med/hard (or any)
// modifies queryParam accordingly
$(document).on("click", ".difficultyButton", function () {
    $("#difficultyDiv").remove();
    if ($(this).attr("data-difficulty") == "any") {
        queryParam += "";
    }
    else {
        difficulty = $(this).attr("data-difficulty");
        queryParam += "&difficulty=" + difficulty;
    }
    difficultyChosen = true;
    console.log(queryParam);
});

//Pre-game: User enters desired number of quesitons
// modifies queryParam accordingly
$("#numQuestionsButton").on("click", function () {
    questionsLimit = $("#numQuestions-input").val().trim();
    $("#number-input").remove();
    questionsLimitChosen = true;
    queryParam += "&amount=" + questionsLimit;
    console.log(queryParam);
});

//HARD CODED QUIZ, FOR TESTING PURPOSES ONLY, REMOVE BEFORE SUBMITTING//

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

function addJoin() {
  var joinDiv = $("<div>");
  joinButton = $("<button>");
  joinButton.attr("class", "btn btn-outline-light");
  joinButton.attr("id", "joinButton");
  joinButton.text("Join");
  joinDiv.attr(
    "class",
    "container text-white text-center m-4 py-4 row px-4 col-sm-12 col-md-6"
  );
  joinDiv.attr("id", "options ");
  joinDiv.append(
    "<p> Join to play previously created game and challenge other players </p>"
  );
  joinDiv.append(joinButton);
  $("#main").append(joinDiv);
}

function addSignupLogin() {
  var signupDiv = $("<div>");
  var signupButton = $("<button>");
  var loginButton = $("<button>");
  var loginSpan = $("<span>");
  loginSpan.attr("class", "exisitingUser");
  signupDiv.attr("class", "userAuth");
  loginSpan.html("or Already an Existing User");
  signupButton.attr("class", "signUp btn-link btn");
  loginButton.attr("class", "logIn btn-link btn");
  signupButton.text("Share");
  loginButton.text("Log In");
  signupDiv.append(signupButton);
  loginSpan.append(loginButton);
  signupDiv.append(loginSpan);
  $("#main").append(signupDiv);
}

// functions for the current trivia game
var triviaGame = {
  triviaQuestions: questionsArr,
  numberQuestion: 0,
  timeLeft: 30,
  correctAnswers: 0,
  incorrectAnswers: 0,
  unansweredQs: 0,

  //30s Timer for each question
  gameTimer: function() {
    $("#timer").html(triviaGame.timeLeft + " seconds remaining");
    triviaGame.timeLeft--;
    if (triviaGame.timeLeft <= 0) {
      triviaGame.outOfTime();
    }
  },

  //function loads question
  currentQuestion: function() {
    $("#main").empty();
    var ticker = $("<div id='timer'>");
    ticker.html(triviaGame.timeLeft + " seconds remaining");
    $("#main").prepend(ticker);
    timer = setInterval(triviaGame.gameTimer, 1000);
    var questionDiv = $("<div>");
    $("#main").append(questionDiv);
    questionDiv.html(
      "<h3>" + questionsArr[triviaGame.numberQuestion].question + "</h3>"
    );

    for (
      var i = 0;
      i < questionsArr[triviaGame.numberQuestion].choices.length;
      i++
    ) {
      questionDiv.append(
        "<button class= 'choiceButton btn btn-outline-light' data-choice= '" +
          questionsArr[triviaGame.numberQuestion].choices[i] +
          "'>" +
          questionsArr[triviaGame.numberQuestion].choices[i] +
          "</button>" +
          "<br></br>"
      );
    }
  },

  // function determines what happens when user clicks a button for their response to the question
  buttonClick: function(event) {
    triviaGame.resetTimer();
    if (
      $(event.target).data("choice") ==
      questionsArr[triviaGame.numberQuestion].answer
    ) {
      triviaGame.correctAns();
    } else {
      triviaGame.wrongAns(questionsArr[triviaGame.numberQuestion].answer);
    }
  },

  //function loads next question
  nextQuestion: function() {
    triviaGame.resetTimer();
    triviaGame.numberQuestion++;
    triviaGame.currentQuestion();
  },

  //function for when the user runs out of time on the current question
  outOfTime: function() {
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

  // when the user guesses the correct answer
  correctAns: function() {
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

  //when the user guesses the wrong answer
  wrongAns: function(answer) {
    triviaGame.resetTimer();
    triviaGame.incorrectAnswers++;
    $("#ticker").html("<p> </p>");
    $("#main").html(
      `<h4> INCORRECT! </h4> <div> Correct answer is: ${answer}</div>`
    );
    if (triviaGame.numberQuestion === questionsArr.length - 1) {
      setTimeout(triviaGame.finalScore, 2000);
    } else {
      setTimeout(triviaGame.nextQuestion, 2000);
    }
  },

  //all questions have been answered/unanswered then results are shown
  finalScore: function() {
    $("#QUESTION").empty();
    $("#main").html("COMPLETE!");
    $("#main").append("<p> </p>" + "Correct: " + triviaGame.correctAnswers);
    $("#main").append("<p> </p>" + "Incorrect: " + triviaGame.incorrectAnswers);
    $("#main").append("<p> </p>" + "Unanswered: " + triviaGame.unansweredQs);
    $("#main").append(
      "<p> Replay this Quiz! </p>" +
        "<button class='btn btn-outline-light' id= 'reset'>" +
        "Go!" +
        "</button>"
    );
    saveQuiz(triviaGame.correctAnswers);
    addJoin();
    addSignupLogin();

    // var joinDiv = $("#joinDiv");
    // $("#main").append(joinDiv);
  },

  //resets the current game
  resetGame: function() {
    triviaGame.correctAnswers = 0;
    triviaGame.incorrectAnswers = 0;
    triviaGame.unansweredQs = 0;
    triviaGame.resetTimer();
    triviaGame.numberQuestion = 0;
    triviaGame.currentQuestion();
  },

  //resets question timer
  resetTimer: function() {
    clearInterval(timer);
    triviaGame.timeLeft = 30;
  }
};
