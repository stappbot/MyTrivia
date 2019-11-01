var opentdbURL = "https://opentdb.com/api.php?&type=multiple";
var queryParam = "";
var numQuestions = 0;
var difficulty = "";
var questionsArr = [];

$("#start").click(function () {
    $("#start").remove();
    triviaGame.currentQuestion();
})

$(document).on("click", "#reset", function () {
    $('#reset').remove();
    $("#main").empty();
    triviaGame.resetGame();

})

$(document).on("click", ".choiceButton", function (event) {
    triviaGame.buttonClick(event);
})

$(document).on("click", ".categoryButton", function () {
    var category = $(this).attr("data-category");
    queryParam = "q=" + category;
    $("#categoriesDiv").remove();
})

$("#numSubmit").on("click", function () {
    var numQuestions = $(this).val()
    queryParam += "&amount=" + numQuestions;
    $("#numQuestionsDiv").remove();
})

$(".difficultyButton").on("click", function () {
    var difficulty = $(this).attr("data-difficulty");
    queryParam += "&difficulty=" + difficulty;
    $("#difficultyDiv").remove();
})



$.ajax({
    url: opentdbURL + queryParam,
    method: 'GET'
}).then(function (response) {
    for (var i = 0; i < response.results.length; i++) {
        questionsArr.push(response.results[i])
        questionsArr[i].question = response.results[i].question;
        randAnswerPos = Math.floor(Math.random() * 4);
        questionsArr[i].answer = response.results[i].correct_answer;
        // questionsArr[i].choices[randAnswerPos] = questionsArr[i].answer;
        for (var j = 0; j < 3 ; j++){
            questionsArr[i].choices.push(response.results.incorrect_answers[j]);
        }
        questionsArr[i].choices.splice(randAnswerPos , 0 , questionsArr[i].answer);
    }
})

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
        $("#QUESTION").html("<h3>" + questionsArr[triviaGame.numberQuestion].question + "</h3>");

        for (var i = 0; i < questionsArr[triviaGame.numberQuestion].choices.length; i++) {
            $("#main").append("<button class= 'choiceButton' data-choice= '" + questionsArr[triviaGame.numberQuestion].choices[i] + "'>" + questionsArr[triviaGame.numberQuestion].choices[i] + "</button>" + "<br></br>");
        }
    },

    buttonClick: function (event) {
        triviaGame.resetTimer();
        if ($(event.target).data("choice") === questionsArr[triviaGame.numberQuestion].answer) {
            triviaGame.correctAns();
        }
        else {
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
        }
        else {
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
        }
        else {
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
        }
        else {
            setTimeout(triviaGame.nextQuestion, 2000);
        }
    },

    finalScore: function () {
        $("#QUESTION").empty();
        $("#main").html("COMPLETE!");
        $("#main").append("<p> </p>" + "Correct: " + triviaGame.correctAnswers);
        $("#main").append("<p> </p>" + "Incorrect: " + triviaGame.incorrectAnswers);
        $("#main").append("<p> </p>" + "Unanswered: " + triviaGame.unansweredQs);
        $("#main").append("<p> </p>" + "<button id= 'reset'>" + "Reset" + "</button>");
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

}