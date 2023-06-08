const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 3000;
// const request = require("request");
const https = require("https");
const API_KEY = "36906064e9513035cf04a8171a9b7562-us10";
const audianceID = "75b1d8e38c";

app.use(express.static("public"));

//redirect to signup page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

//setting bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }));

//signup route setting up post method and connecting to the mailchimp server
app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  //setting up data for mailchimp endpoint
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = `https://us10.api.mailchimp.com/3.0/lists/${audianceID}`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `auth ${API_KEY}`,
    },
  };

  //setting up response for success & failure
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    // getting data
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  // sinmitting data to mailchimp
  request.write(jsonData);
  request.end();
});

//redirect to the main page if failed
app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  //this allow to work with heroku ||(or symbol) for local run
  console.log("3000 running");
});

// API Key-  ef24c7c1f346ecd5152129fcb3eb3b19-us10
// List id - 75b1d8e38c
