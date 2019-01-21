const app = require("./app");
const PORT = process.env.PORT || 5001; // Heroku runs on a different port, defined in the environmental variable PORT

var server = app.listen(PORT, function() {
  console.log("app running on port.", server.address().port);
});
