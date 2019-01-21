var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const axios = require("axios");
var app = express();

// Setup CORS header. More complex alternative: setup a proxy server
const FRONTEND_URL_PRODUCTION = "http://reddit-feed-frontend.herokuapp.com";
const FRONTEND_URL_DEV = "http://localhost:3000";
var whitelist = [FRONTEND_URL_DEV, FRONTEND_URL_PRODUCTION];

var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // Allow testing requests
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

// Pass options to cors
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function transformToMyData(originalData) {
  const postsArray = originalData.children;

  const resultArray = postsArray.map(originalPostObject => {
    const postObjectWithoutEnvelope = originalPostObject.data;

    const myPostObject = {
      url: postObjectWithoutEnvelope.url,
      title: postObjectWithoutEnvelope.title,
      score: postObjectWithoutEnvelope.score,
      subredditName: postObjectWithoutEnvelope.subreddit,
      linkToOriginalRedditPost:
        "https://reddit.com" + postObjectWithoutEnvelope.permalink, // original permalink starts with r/....
      numberOfComments: postObjectWithoutEnvelope.num_comments,
      createdTimestamp: postObjectWithoutEnvelope.created_utc,
      author: postObjectWithoutEnvelope.author
    };

    // Thumbnail should be a url only if it exists
    if (
      postObjectWithoutEnvelope.thumbnail &&
      postObjectWithoutEnvelope.thumbnail !== "self"
    ) {
      myPostObject.thumbnail = postObjectWithoutEnvelope.thumbnail;
    }

    return myPostObject;
  });

  return resultArray;
}

app.get("/api/subreddit/:subredditName", function(req, res) {
  const subredditName = req.params.subredditName;

  // Subreddit regex from reddit's github
  // https://github.com/reddit-archive/reddit/blob/da549027955c28b2e99098a22c814fc2ba729e11/r2/r2/models/subreddit.py#L114
  const subredditValidationRegex = /^[A-Za-z0-9][A-Za-z0-9_]{2,20}$/;

  if (!subredditValidationRegex.test(subredditName)) {
    // Bad subreddit name
    res.status(400).send(`Illegal subreddit name: r/${subredditName}`);
    return;
  }

  const url = `http://www.reddit.com/r/${subredditName}/top/.json?t=all&limit=20`; // top posts of all time

  axios
    .get(url)
    .then(response => {
      const responseBody = response.data;
      const myData = transformToMyData(responseBody.data);
      const numberOfPosts = responseBody.data.dist;

      if (numberOfPosts === 0) {
        res.status(404).send(`Subreddit r/${subredditName} doesn't exist`);
      } else {
        res.status(200).json({ data: myData });
      }
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.reason) {
        const errorReason = error.response.data.reason;
        if (errorReason === "private") {
          // Community is private
          res.status(403).send(`Subreddit r/${subredditName} is private`);
          return;
        }
        if (errorReason === "banned") {
          // Community is banned
          res.status(403).send(`Subreddit r/${subredditName} is banned`);
          return;
        }
        if (errorReason === "quarantined") {
          // Community is quarantined
          res.status(403).send(`Subreddit r/${subredditName} is quarantined`);
          return;
        }
      } else if (error.response.status === 404) {
        res.status(404).send(`Subreddit r/${subredditName} doesn't exist`);
        return;
      } else {
        res.status(500); // Internal server error
        return;
      }
    });
});

module.exports = app;
