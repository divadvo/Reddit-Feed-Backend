# Reddit Feed Backend

Backend for a simple Reddit feed app

[Deployed to heroku](https://reddit-feed-backend.herokuapp.com/api/subreddit/news/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Node, npm and preferably yarn should be installed.
Clone this repository into your prefered location.

```
$ git clone https://github.com/divadvo/Reddit-Feed-Backend
$ cd Reddit-Feed-Backend
```

### Installing

First install the dependencies using `yarn`

```
$ yarn
```

### Run locally

```
$ yarn start
```

The main endpoint will be available at `localhost:5001/api/subreddit/{subredditName}`

## Running the tests

The tests will test the API endpoint. Tests are in `app.test.js`

```
$ yarn test
```

## Deployment

Create a new app on Heroku. Use this buildpack for Node: `https://github.com/heroku/heroku-buildpack-nodejs`

Deploy frontend: [Frontend Repository](https://github.com/divadvo/Reddit-Feed-Frontend)

Change `FRONTEND_URL_PRODUCTION` in `app.js` to allow CORS request from frontend.

## Built With

- Express.js
- Axios - HTTP client for making Reddit API requests
- Jest - For testing

## How it works

- The endpoint gets the subreddit name as parameter.
- First I check if the subreddit name is legal, based on a regex.
- Next I call the Reddit API to get the top posts of all time. I create a new reponse object based on the received data and keep only the necessary information.
- If errors occur (subreddit doesn't exist / banned / private / quarantined) I respond with 403 / 404.

All this code is in `app.js`

## Author

- **David Stepanov** - [divadvo](https://github.com/divadvo)
