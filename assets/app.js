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
var submitBtn = $(".submitBtn");
var userID = $(".userID");
var form = $(".enterUsername")
var user = false;

submitBtn.on("click", function (event) {
    event.preventDefault();
    //var test = database.ref().equalTo(userID).on('child_added', function (snapshot) {
    //    console.log(snapshot.size)
    //});
    var usernames = database.ref("usernames")
    if (userID.val() !== "") {
        var username = userID.val().trim();
        usernames.push({
            userID: username
        })
        form.text("Username: " + username);
        form.append("<button class='btn btn-dark signOut'>Sign Out</button>");
        user = true;

    }
    console.log()
});



