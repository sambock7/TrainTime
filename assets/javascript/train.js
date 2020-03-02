// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBf31ZE1E3pgttvIYwbFc8IcSLrXO2wvPw",
    authDomain: "traintime-b0e62.firebaseapp.com",
    databaseURL: "https://traintime-b0e62.firebaseio.com",
    projectId: "traintime-b0e62",
    storageBucket: "traintime-b0e62.appspot.com",
    messagingSenderId: "774887772314",
    appId: "1:774887772314:web:2b37717046626b88e48f23",
    };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// set variable to reference database
var database = firebase.database();

//set initial global variables and values
var trainName = "";
var trainDestination = "";
var firstTime = "";
var frequency = "";
var rowCounter = 1;

//on-click event when current user clicks submit button
$("#submit").on("click", function(event){
    //prevents page from reloading
    event.preventDefault();

    trainName = $("#trainNameInput").val().trim();
    trainDestination = $("#destinationInput").val().trim();
    trainTime = $("#timeInput").val().trim();
    frequency = $("#frequencyInput").val().trim();

//Moment js

        //pushed back a month
        var trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "months");
        // Current Time
        var currentTime = moment();
        // Difference between the start and current times
        var difference = moment().diff(moment(trainTimeConverted), "minutes");
        // Time passed since last train
        var timeRemainder = difference % frequency;
        // Minutes left Until Train
        var countdownToTrain = frequency - timeRemainder;
        // Next Train
        var nextTrain = moment().add(countdownToTrain, "minutes");
    
    //console log the input data submitted by the user
    console.log("train name input " + trainName);
    console.log("train destination: " + trainDestination);
    console.log("train time: " + trainTime);
    console.log("frequency: " + frequency);
    console.log("Current time is: " + moment(currentTime).format("hh:mm"));
    console.log("Next Arrival Time: " + moment(nextTrain).format("hh:mm"));
    console.log("The minutes since the last train: " + timeRemainder);
    console.log("The minutes until the next train: " + countdownToTrain);

    //push the submitted data as a child object to the firebase database
    database.ref().push({
        trainName: trainName,
        trainDestination: trainDestination,
        trainTime: trainTime,
        frequency: frequency,
        countdownToTrain: countdownToTrain,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#timeInput").val("");
    $("frequencyInput").val("");


});

// Firebase watcher .on("child_added")
database.ref().on("child_added", function(snapshot) {
    // storing the snapshot.val() as a variable
    var snap = snapshot.val();

    // Console.logging the last user's JSON
    console.log(snap);

    var nextTrainTime = moment().add(snap.countdownToTrain, "minutes").format("hh:mm A");
    
    var newRow = "<tr id='row-"+rowCounter+"'><td>" 
    + snap.trainName + "</td><td>" 
    + snap.trainDestination + "</td><td>Every " 
    + snap.frequency + " minutes</td><td>" 
    + nextTrainTime + "</td><td>" 
    + snap.countdownToTrain + " minutes</td><td></tr>"
    
    $(".train-table").append(newRow);
    console.log(rowCounter);
    rowCounter++;

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

