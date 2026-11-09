// Express.js Intro - write your server here.
// Run it with: node index.js   (stop it with Ctrl + C)

// Part 1: create an express app, a GET /greet endpoint and app.listen(3000)
const express = require("express");
const app = express();
const PORT = 3000;
const CAT_API_KEY = process.env.CAT_API_KEY;
app.use(express.json());

app.get("/greet", (req, res) => {
  res.json({
    msg: `hi from get endpoint ${new Date().toISOString()}`,
  });
});

app.get("/greet/:name", (req, res) => {
  console.log(`i got name: ${req.params.name}`);
  res.json({
    msg: `got name: ${req.params.name}`,
  });
});

app.get("/test", async (req, res) => {
  const greet_res = await fetch("http://localhost:3000/greet/Bob");

  const greet_data = await greet_res.json();

  if ("msg" in greet_data && greet_data.msg === "got name: Bob") {
    res.json({
      result: "ok",
    });
  } else {
    res.json({
      result: "fail",
    });
  }
});

app.post("/action", async (req, res) => {
  if (!req.body || Object.keys(req.body).length !== 1) {
    res.status(400).json({ msg: "body is malformed" });
  } else {
    if (req.body.action === "joke" || req.body.action === "cat fact") {
      if (req.body.action === "joke") {
        try {
          const fetch_joke = await fetch(
            "https://v2.jokeapi.dev/joke/Any?type=single&safe-mode",
          );

          const joke = await fetch_joke.json();

          res.json({ joke: `${joke.joke.toUpperCase()}` });
        } catch (e) {
          console.log(e);
        }
      } else if (req.body.action === "cat fact") {
        try {
          const fetch_cat = await fetch(
            "https://api.thecatapi.com/v1/images/search?limit=11",
            {
              headers: { "x-api-key": CAT_API_KEY },
            },
          );

          const cat = await fetch_cat.json();

          res.json({ length: `${cat.length}` });
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      res.status(400).json({ msg: "body is malformed" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Part 3: POST /action  ("joke" / "cat fact", otherwise 400 "body is malformed")
