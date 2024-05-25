const express = require("express"),
  morgan = require("morgan");

const app = express();

app.use(morgan("common"));
app.use(express.static("public"));

let topMovies = [
  {
    title: "The Avengers",
  },

  {
    title: "Avengers: Age of Ultron",
  },

  {
    title: "Avengers: Infinity War",
  },

  {
    title: "Avengers: Endgame",
  },

  {
    title: "Avengers: Secret Wars",
  },

  {
    title: "Deadpool",
  },

  {
    title: "Deadpool 2",
  },

  {
    title: "Deadpool & Wolverine",
  },

  {
    title: "Black Panther",
  },

  {
    title: "Black Panther: Wakanda Forever",
  },
];

// GET requests
app.get("/", (req, res) => {
  res.send("Avengers Assemble!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

//MORGAN REQUESTS LOGS
app.use(myLogger);
app.use(requestTime);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", (req, res) => {
  let responseText = "Welcome to my app!";
  responseText += "<small>Requested at: " + req.requestTime + "</small>";
  res.send(responseText);
});

app.get("/secreturl", (req, res) => {
  let responseText = "This is a secret url with super top-secret content.";
  responseText += "<small>Requested at: " + req.requestTime + "</small>";
  res.send(responseText);
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
