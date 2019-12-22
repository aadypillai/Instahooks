'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server
  app.use(express.urlencoded());
var
  commentID = "",
  giftCode = "",
  mediaID = "";

const admin = require("firebase-admin");
var serviceAccount = require("C:\\Users\\light\\Downloads\\final-62cab-firebase-adminsdk-1kwwk-57853f0c4f.json");

process.env.FIREBASE_CONFIG = JSON.stringify({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'final-62cab',
    databaseURL: "https://final-62cab.firebaseio.com"
});
const functions = require('firebase-functions');

admin.initializeApp({
    projectId: 'final-62cab',
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://final-62cab.firebaseio.com"
});


// Get a database reference 
var db = admin.database();
var ref = db.ref();

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {   
 1
    let body = req.body;
    // console.log(body);
    // Checks this is an event from Instagram 
    if (body.object === 'instagram') {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
        commentID = entry.changes[0].value.comment_id; 
        mediaID = "26698016284";    
        // console.log(mediaID);
        giftCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        // console.log("https://graph.facebook.com/" + mediaID + "?fields=mentioned_comment.comment_id(" + commentID + ")&access_token=732685013884317|7NNFaqJRJnZI8tKqcqhOLqWiUPE");
//         const request = require('request');
//           request("https://graph.facebook.com/" + mediaID + "?fields=mentioned_comment.comment_id(" + commentID + ")&access_token=EAAKaX4X8HZA0BABn6sidZBeSnYwwTimE29mcDG73izELziIdLHKOVM4vtBpyAtTuP2Fgk9ic0uWsrUKiTWcN872EdQG08fl9EU2C6fZBUVW9ZC8BbumjjbwDZCopolrqHN6s8hU3LjR45jDSrd9OOsKRbimpgZC33p7e07qBBn3zim76xwpZCPZCdcZBwr5ZALt5Kx6j868SXcEUvklSLIfMX7o4ANi8WBuYEZD", function (error, response, body) {
//           console.error('error:', error); // Print the error if one occurred
//           console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//           console.log('body:', body); // Print the HTML for the Google homepage.
// });
        var newUserRef = ref.push();
        newUserRef.set({
          GiftCode: giftCode,
          ID: commentID,
          Value: "5"
        })
        console.log(giftCode);
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
      }); 
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });
  
  
  // const snapshot = await admin.database().ref('/users').push({Name: Name});
  // const snapshot = await admin.database().ref('/messages/{pushId}/original').push({ID: ID});
  // const snapshot = await admin.database().ref('/messages/{pushId}/original').push({Value: Value});
  // res.redirect(303, snapshot.ref.toString());
  // Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });
  